const express = require("express");
var http = require("http");
const dotenv = require("dotenv");
const path = require("path");
const { Client } = require("pg");

dotenv.config();

const dbclient = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_IP,
    database: process.env.DB_DB,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT ? process.env.DB_PORT : 5432
});
const fs = require("fs");
const app = express();
const server = http.createServer(app);
const ws = require("ws");
const wss = new ws.Server({ server });

const RateLimit = require("express-rate-limit");
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
app.use(express.static(path.join(__dirname, "/dist")));

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
let oldStatus;
setInterval(async () => {
    // If no one is connected, don't query the database
    if (wss.clients.size == 0) {
        return;
    }
    const status = await loadStatsFromDatabase();
    wss.clients.forEach(client => {
        if (client != ws) {
            if (JSON.stringify(oldStatus) !== JSON.stringify(status)) {
                client.send(JSON.stringify(status));
            }
        }
    });
    oldStatus = status;
}, 2000);

app.get(["/botti", "/"], async (req, res) => {
    const token = req.query.token;
    let config = JSON.parse(fs.readFileSync(pathString, "utf8"));

    const tokenObjecktOderSo = config.find(objeckt => objeckt.token == token);

    if (tokenObjecktOderSo) {

        const kabutt = (new Date).getTime() - tokenObjecktOderSo.date > 5 * 60 * 1000;

        const index = config.indexOf(tokenObjecktOderSo);

        if (kabutt) {

            if (index > -1) {
                config.splice(index, 1);
            }

            fs.writeFileSync(pathString, JSON.stringify(config));

            res.sendStatus(410);

            return;

        }

        config[index].date = (new Date).getTime();

        fs.writeFileSync(pathString, JSON.stringify(config));
        res.sendFile(__dirname + "/dist/botti/public/index.html");
    } else {
        devEnv = process.env.DEV_ENV ? process.env.DEV_ENV : "produnction";
        if (devEnv == "production") res.sendStatus(403);
        else res.sendFile(__dirname + "/dist/botti/public/index.html");
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

    let status = {};
    status.totals = {};
    status.ids = {};

    for (const key in query.rows[0]) {
        status.totals[key] = query.rows.reduce(function (accumulator, item) {
            return accumulator + item[key];
        }, 0);
    }

    for (let i = 0; i < query.rows.length; i++) {
        status.ids[query.rows[i].UserId] = query.rows[i];
    }

    return status;
}
