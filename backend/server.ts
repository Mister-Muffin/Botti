import express from "express";
import RateLimit from "express-rate-limit";
import WebSocket, { WebSocketServer } from "ws";
import http from "node:http";
import path, { dirname } from "node:path";
import { load } from "dotenv";
import { fileURLToPath } from "node:url";
import pg from "pg";
import type { AccessListEntry } from "./types.ts";
import { loadStatsFromDatabase } from "./db.ts";
import { broadcastData, terminateDeadConnections } from "./websocket.ts";

const env = await load({
    envPath: "../.env",
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(dirname(__filename), ".."); // move out of the tsbuild and dist directory
const websitePath = path.join("..", "website/dist");

const { Client } = pg;

const dbclient = new Client({
    user: env["DB_USER"],
    host: env["DB_IP"],
    database: env["DB_DB"],
    password: env["DB_PASS"],
    port: env["DB_PORT"] as unknown as number || 5432,
});
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const pathString = `${__dirname}/data/access.json`;
const expressPort: number = env["PORT"] as unknown as number || 5000;
const devEnv = env["DEV_ENV"] || "produnction";
const isEnvProduction = devEnv === "production";

const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 300,
    message: "Too many requests from this IP, please try again after a minute",
});

export interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
}

// Connect to the Postgres Database
await dbclient.connect();
console.log("Successfully connected to Database");

if (env["PROXY_IP"]) app.set("trust proxy", env["PROXY_IP"]);

server.listen(expressPort, () => {
    console.log(`Express running → PORT ${expressPort}`);
    if (!isEnvProduction) console.info(`Express local URL: http://[::1]:${expressPort}`);
});

app.use(limiter);
app.use(express.static(websitePath));

/*
https://masteringjs.io/tutorials/express/websockets,
https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4
*/
wss.on("connection", async (socket: ExtWebSocket) => {
    socket.isAlive = true;
    socket.on("pong", () => {
        socket.isAlive = true;
    });

    socket.send(JSON.stringify(await loadStatsFromDatabase(dbclient)));
    //socket.on("message", message => console.log(message));
});
//https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4
setInterval(terminateDeadConnections, 10000, wss);

setInterval(broadcastData, 2000, wss, dbclient);

app.get(["/botti", "/"], (req, res) => {
    const reqToken = req.query.token;
    const accessList = JSON.parse(Deno.readTextFileSync(pathString));
    const token = accessList.find((object: AccessListEntry) => object.token == reqToken);

    if (token) {
        const index = accessList.indexOf(token);
        const tokenExpired = (new Date()).getTime() - token.date > 5 * 60 * 1000;
        if (tokenExpired) {
            removeIndexFromList(index, accessList);

            return res.sendStatus(410);
        }

        accessList[index].date = (new Date()).getTime();

        Deno.writeTextFileSync(pathString, JSON.stringify(accessList));
        res.sendFile(path.join(websitePath, "website/public/index.html"));
    } else {
        if (isEnvProduction) res.sendStatus(403);
        else res.sendFile(path.join(websitePath, "website/public/index.html"));
    }
});

app.get("/botti/stats", async (req, res) => {
    try {
        const stats = await loadStatsFromDatabase(dbclient);
        res.send(stats);
    } catch (e) {
        console.error(e);
        res.sendStatus(503);
    }
});

function removeIndexFromList(index: number, accessList: Array<unknown>) {
    if (index > -1) {
        accessList.splice(index, 1);
    }

    Deno.writeTextFileSync(pathString, JSON.stringify(accessList));
}
