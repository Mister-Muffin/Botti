const express = require('express');
const fs = require('fs');
const app = express();

const pathString = `${__dirname}/data/access.json`;

const admin = require('firebase-admin');
admin.initializeApp(JSON.parse(process.env.SERVICE_ACCOUNT_KEY));

const db = admin.firestore();
const docRefEhre = db.doc('bot/ehre');
const docRefAlla = db.doc('bot/alla');
const docRefSchaufeln = db.doc('bot/schaufeln');
const docRefYeet = db.collection('bot/yeet/yeeter');

const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

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

    let stats = {};

    await docRefAlla.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such doc!');
                return;
            }
            stats.alla = doc.data().alla;
        }).catch(error => {
            console.log(error);
        });

    await docRefEhre.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such doc!');
                return;
            }
            stats.ehre = doc.data().ehre;
        }).catch(error => {
            console.log(error);
        });

    await docRefSchaufeln.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such doc!');
                return;
            }
            stats.schaufeln = doc.data().schaufeln;
        }).catch(error => {
            console.log(error);
        });

    stats.yeet = {}
    await docRefYeet.get()
        .then(collection => {
            let docs = collection.docs;
            docs.forEach(doc => {
                stats.yeet[doc.id] = doc.data()
            })
            //stats.yeet = doc.data().yeet;
        }).catch(error => {
            console.log(error);
        });

    res.send(stats)
});