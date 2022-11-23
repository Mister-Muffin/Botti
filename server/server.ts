import express from "express";
import RateLimit from "express-rate-limit";
import WebSocket, { WebSocketServer } from 'ws';
import http from "http";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";
import pg from "pg";
import { Status, User } from "./types";

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

const limiter = new RateLimit({
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
wss.on("connection", async socket => {
    socket.isAlive = true;
    socket.on("pong", () => {
        socket.isAlive = true;
    });

    socket.send(JSON.stringify(await loadStatsFromDatabase()));
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
    const status = await loadStatsFromDatabase();
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
    const token = accessList.find(object => object.token == reqToken);

    if (token) {

        const kabutt = (new Date).getTime() - token.date > 5 * 60 * 1000;

        const index = accessList.indexOf(token);

        if (kabutt) {

            if (index > -1) {
                accessList.splice(index, 1);
            }

            fs.writeFileSync(pathString, JSON.stringify(accessList));

            res.sendStatus(410);

            return;

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
        const status = await loadStatsFromDatabase();
        res.send(status);
    } catch (e) {
        console.error(e);
        res.sendStatus(503);
    }
});

async function loadStatsFromDatabase() {
    const query = await dbclient.query("SELECT \"UserId\", \"Alla\", \"Ehre\", \"Yeet\", \"Schaufel\", \"Username\", \"Xp\", \"Messages\" FROM users");

    const status: Status = {
        totals: {},
        ids: {}
    };

    for (const key in query.rows[0]) {
        // Only sum up if it makes sense to sum. (Do not sum user ids/names)
        if (["Alla", "Ehre", "Yeet", "Schaufel", "Xp", "Messages"].includes(key))
            status.totals[key as keyof Totals] = Number(query.rows.reduce((accumulator, item) => {
                return Number(accumulator) + Number(item[key]);
            }, 0));
    }

    for (let i = 0; i < query.rows.length; i++) {
        const userId: string | unknown = query.rows[i].UserId;
        if (userId != null) {
            try {
                status.ids[userId as keyof User] = query.rows[i];
                status.ids[userId as keyof User].Xp = Number(status.ids[userId as keyof User].Xp);
                status.ids[userId as keyof User].UserId = Number(status.ids[userId as keyof User]);
                status.ids[userId as keyof User].Messages = Number(status.ids[userId as keyof User].Messages);
            } catch { /**/ }
        }
    }

    return status;
}
