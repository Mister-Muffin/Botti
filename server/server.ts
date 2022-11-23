import express from "express";
import RateLimit from "express-rate-limit";
import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";
import pg from "pg";
import { Status, AccessList } from "./types";
import { loadStatsFromDatabase } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(dirname(__filename), "../.."); // move out of the tsbuild and dist directory 

const { Client } = pg;

dotenv.config();

const dbclient = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_IP,
    database: process.env.DB_DB,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT as unknown as number ? process.env.DB_PORT as unknown as number : 5432
});
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 300,
    message:
        "Too many requests from this IP, please try again after a minute"
});

async function initializeDB() {
    await dbclient.connect();
    console.log("Successfully connected to Database");
}
initializeDB();

const pathString = `${__dirname}/data/access.json`;

server.listen(process.env.PORT || 5000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

app.use(limiter);
app.use(express.static(path.join(__dirname, "/dist/website")));

/*
https://masteringjs.io/tutorials/express/websockets,
https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4
*/
wss.on("connection", async (socket: WebSocket) => {
    socket.isAlive = true;
    socket.on("pong", () => {
        socket.isAlive = true;
    });

    socket.send(JSON.stringify(await loadStatsFromDatabase(dbclient)));
    //socket.on("message", message => console.log(message));
});
//https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4
setInterval(() => {
    wss.clients.forEach((ws) => {

        if (!ws.isAlive) return ws.terminate();

        ws.isAlive = false;
        ws.ping();
    });
}, 10000);

// only send Data if Data has changed
let oldStatus: Status;
setInterval(async () => {
    // If no one is connected, don't query the database
    if (wss.clients.size == 0) {
        return;
    }
    const status = await loadStatsFromDatabase(dbclient);
    wss.clients.forEach(client => {
        if (client != wss) {
            if (JSON.stringify(oldStatus) !== JSON.stringify(status)) {
                client.send(JSON.stringify(status));
            }
        }
    });
    oldStatus = status;
}, 2000);

app.get(["/botti", "/"], async (req, res) => {
    const reqToken = req.query.token;
    const accessList = JSON.parse(fs.readFileSync(pathString, "utf8"));
    const token = accessList.find((object: AccessList) => object.token == reqToken);

    if (token) {
        const index = accessList.indexOf(token);
        const tokenExpired = (new Date).getTime() - token.date > 5 * 60 * 1000;
        if (tokenExpired) {
            removeIndexFromList(index, accessList);

            return res.sendStatus(410);
        }

        accessList[index].date = (new Date).getTime();

        fs.writeFileSync(pathString, JSON.stringify(accessList));
        res.sendFile(__dirname + "/dist/website/botti/public/index.html");
    } else {
        const devEnv = process.env.DEV_ENV ? process.env.DEV_ENV : "produnction";
        if (devEnv == "production") res.sendStatus(403);
        else res.sendFile(__dirname + "/dist/website/botti/public/index.html");
    }
});

app.get("/botti/stats", async (req, res) => {
    try {
        const status = await loadStatsFromDatabase(dbclient);
        res.send(status);
    } catch (e) {
        console.error(e);
        res.sendStatus(503);
    }
});

function removeIndexFromList(index: number, accessList: Array<unknown>) {
    if (index > -1) {
        accessList.splice(index, 1);
    }

    fs.writeFileSync(pathString, JSON.stringify(accessList));
}
