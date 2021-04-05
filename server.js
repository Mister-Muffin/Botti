const express = require('express');
const dotenv = require("dotenv");
const mongoClient = require('mongodb').MongoClient;
dotenv.config()
const dburl = `mongodb://${process.env.MONGO_USER}\
:${process.env.MONGO_PASS}\
@${process.env.MONGO_IP}\
:${process.env.MONGO_PORT ? process.env.MONGO_PORT : 27017}\
/${process.env.MONGO_DB}?authMechanism=${process.env.MONGO_AUTH_MECHANISM}`;
const fs = require('fs');
const app = express();

const RateLimit = require('express-rate-limit');
const limiter = new RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 500,
    message:
        "Too many accounts created from this IP, please try again after a minute"
});

let mongoDB, bottiDB;
async function initializeDB() {
    try {
        mongoDB = await mongoClient.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true })

        bottiDB = mongoDB.db("botti");
    } catch (e) {
        console.warn("API down!");
    }
}
initializeDB()

const pathString = `${__dirname}/data/access.json`;
// let goldJson;
// try {
//     goldJson = require(pathString);
// } catch (e) {
//     console.warn(e);
//     fs.writeFileSync(pathString, JSON.stringify({}));
//     goldJson = require(pathString);
// }

const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

app.use(limiter)
app.use(express.static(__dirname + '/public'));

app.get(['/botti', '/'], async (req, res) => {
    const token = req.query.token;
    let config = JSON.parse(fs.readFileSync(pathString, 'utf8'));

    const tokenObjecktOderSo = config.find(objeckt => objeckt.token == token)

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

app.get(['/botti/stats', '/'], async (req, res) => {

    try {

        let stats = {};
        const allStats = ["alla", "ehre", "yeet", "schaufeln"]

        for (stat of allStats) {
            const result = await bottiDB.collection(stat).find({ value: { $gt: 0 } }).toArray();
            let total = [];
            let id = [];

            result.forEach(function (task) {
                total.push(task.value);
            });
            result.forEach(function (task) {
                id.push(task.id);
            });
            stats[stat] = { total: total.reduce((acc, curr) => acc + curr), result }
            // let currStat = result ? result.value : 0;

        }
        console.log(stats.alla.result.value)
        console.log(stats);

        res.send(stats)

    } catch (e) {
        res.sendStatus(503);
    }
});