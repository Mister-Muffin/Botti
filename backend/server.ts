// @deno-types="npm:@types/node"
import pg from "pg";
import { Application, Router } from "oak";
import { load } from "dotenv";
import { loadStatsFromDatabase } from "./db.ts";
import { broadcastData } from "./websocket.ts";
import type { AccessListEntry } from "./types.ts";

const env = await load({
    envPath: "../.env",
});

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

const webPort: number = env["PORT"] as unknown as number || 5000;
const devEnv = env["DEV_ENV"] || "produnction";
const isEnvProduction = devEnv === "production";

// Connect to the Postgres Database
await dbclient.connect();
console.log("Successfully connected to Database");

setInterval(broadcastData, 2000, connectedClients, dbclient);

router.get("/ws", async (ctx) => {
    const socket = await ctx.upgrade();
    connectedClients.push(socket);

    console.log(`New client connected`);

    // when a client disconnects, remove them from the connected clients list
    // and broadcast the active users list
    socket.onclose = () => {
        console.log(`Client disconnected`);
        connectedClients.splice(connectedClients.indexOf(socket), 1);
    };
});

router.get("/stats", async (ctx) => {
    try {
        const stats = await loadStatsFromDatabase(dbclient);
        return ctx.response.body = stats;
    } catch (e) {
        console.error(e);
        return ctx.response.status = 503;
    }
});

app.use(async (ctx, next) => {
    try {
        if (ctx.request.url.pathname == "/ws") {
            return next();
        }
        if (ctx.request.url.pathname == "/stats") {
            return next();
        }

        const reqToken = ctx.request.url.searchParams.get("token");
        const accessList: AccessListEntry[] = JSON.parse(Deno.readTextFileSync("../data/access.json"));
        const token = accessList.find((object: AccessListEntry) => object.token == reqToken);

        if (token) {
            const index = accessList.indexOf(token);
            const tokenExpired = (new Date()).getTime() - token.date > 5 * 60 * 1000;
            if (tokenExpired) {
                removeIndexFromList(index, accessList);

                return ctx.response.status = 410;
            }

            accessList[index].date = (new Date()).getTime();

            Deno.writeTextFileSync("../data/access.json", JSON.stringify(accessList));
            return ctx.send({ root: "../website/dist", index: "index.html" });
        } else {
            if (isEnvProduction) return ctx.response.status = 403;
            else await ctx.send({ root: "../website/dist", index: "index.html" });
        }
    } catch (e) {
        console.warn("Catched error:", e);
        await next();
    }
});

function removeIndexFromList(index: number, accessList: Array<unknown>) {
    if (index > -1) {
        accessList.splice(index, 1);
    }

    Deno.writeTextFileSync("../data/access.json", JSON.stringify(accessList));
}

app.use(router.routes());

await app.listen({ port: webPort });
console.log(`Server running → PORT ${webPort}`);
if (!isEnvProduction) console.info(`Express local URL: http://[::1]:${webPort}`);
