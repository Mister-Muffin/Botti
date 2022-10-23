const express = require("express");
const dotenv = require("dotenv");
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

const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

app.use(limiter);
app.use(express.static(__dirname + "/public"));

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

        res.sendFile(__dirname + "/public/" + "index.html");
    } else {
        res.sendStatus(403);
    }
});

app.get("/botti/stats", async (req, res) => {

    try {
        const query = await dbclient.query("SELECT \"UserId\", \"Alla\", \"Ehre\", \"Yeet\", \"Schaufel\", \"Username\" FROM users");
        console.log(query.rows);

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

        console.log(status);

        res.send(status);

    } catch (e) {
        console.error(e);
        res.sendStatus(503);
    }
});