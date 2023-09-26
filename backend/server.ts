import { Application, Router } from "oak";
// @deno-types="npm:@types/node"
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "dotenv";
import pg from "pg";
import type { AccessListEntry } from "./types.ts";
import { loadStatsFromDatabase } from "./db.ts";
import { broadcastData, terminateDeadConnections } from "./websocket.ts";
import { db } from "https://deno.land/std@0.200.0/media_types/_db.ts";

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

const connectedClients: WebSocket[] = [];

const app = new Application();
const router = new Router();

const pathString = `${__dirname}/data/access.json`;
const webPort: number = env["PORT"] as unknown as number || 5000;
const devEnv = env["DEV_ENV"] || "produnction";
const isEnvProduction = devEnv === "production";

export interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
}

// Connect to the Postgres Database
await dbclient.connect();
console.log("Successfully connected to Database");

/*
https://masteringjs.io/tutorials/express/websockets,
https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4
*/
// wss.on("connection", async (socket: ExtWebSocket) => {
//     socket.isAlive = true;
//     socket.on("pong", () => {
//         socket.isAlive = true;
//     });

//     socket.send(JSON.stringify(await loadStatsFromDatabase(dbclient)));
//     //socket.on("message", message => console.log(message));
// });
//https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4
// setInterval(terminateDeadConnections, 10000, wss);

setInterval(broadcastData, 2000, connectedClients, dbclient);

router.get("/ws", async (ctx) => {
    const socket = await ctx.upgrade();
    connectedClients.push(socket);

    console.log(`New client connected`);

    // broadcast the active users list when a new user logs in
    socket.onopen = () => {};

    // when a client disconnects, remove them from the connected clients list
    // and broadcast the active users list
    socket.onclose = () => {
        console.log(`Client disconnected`);
        connectedClients.splice(connectedClients.indexOf(socket), 1);
    };
});

app.use(async (ctx, next) => {
    try {
        if (ctx.request.url.pathname == "/ws") {
            return next();
        }

        const reqToken = ctx.request.headers.get("token");
        const accessList = [{}];
        const token = accessList.find((object: AccessListEntry) => object.token == reqToken);

        if (token) {
            const index = accessList.indexOf(token);
            const tokenExpired = (new Date()).getTime() - token.date > 5 * 60 * 1000;
            if (tokenExpired) {
                removeIndexFromList(index, accessList);

                return ctx.response.status = 410;
            }

            accessList[index].date = (new Date()).getTime();

            Deno.writeTextFileSync(pathString, JSON.stringify(accessList));
            return ctx.send({ root: "../website/dist", index: "index.html" });
        } else {
            if (isEnvProduction) return ctx.response.status = 403;
            else await ctx.send(path.join(websitePath, "website/public/index.html"));
        }
    } catch {
        await next();
    }
});

// app.get("/botti/stats", async (req, res) => {
//     try {
//         const stats = await loadStatsFromDatabase(dbclient);
//         res.send(stats);
//     } catch (e) {
//         console.error(e);
//         res.sendStatus(503);
//     }
// });

function removeIndexFromList(index: number, accessList: Array<unknown>) {
    if (index > -1) {
        accessList.splice(index, 1);
    }

    Deno.writeTextFileSync(pathString, JSON.stringify(accessList));
}

app.use(router.routes());

await app.listen({ port: webPort });
console.log(`Server running → PORT ${webPort}`);
if (!isEnvProduction) console.info(`Express local URL: http://[::1]:${webPort}`);
