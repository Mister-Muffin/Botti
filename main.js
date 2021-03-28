const Discord = require('discord.js');

const dotenv = require("dotenv")
dotenv.config()
const mongoClient = require('mongodb').MongoClient;
const dburl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_IP}:${process.env.MONGO_PORT ? process.env.MONGO_PORT : 27017}`;

const fs = require('fs');
const { readdirSync } = require("fs");
const path = require('path');
const appDir = path.dirname(require.main.filename);
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT_KEY)), });
const db = admin.firestore();
const docRef = db.doc('bot/ehre');
const docRefAlla = db.doc('bot/alla');
const docRefYeet = db.collection('bot/yeet/yeeter');
const config = JSON.parse(process.env.CONFIG);
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
let currEhre = 0;
let currAlla = 0;
let currYeet = 0;
var lukasKrasseEuroEtoroVerdiensteMitEhreInklusiveAufEhrenbasis = "YAMAN!";
lukasKrasseEuroEtoroVerdiensteMitEhreInklusiveAufEhrenbasis = lukasKrasseEuroEtoroVerdiensteMitEhreInklusiveAufEhrenbasis;

const pathString = `${appDir}/data/gold.json`;
let goldJson;
try {
    goldJson = require(pathString);
} catch (e) {
    console.warn(e);
    fs.writeFileSync(pathString, JSON.stringify({}));
    goldJson = require(pathString);
}

// mongoClient.connect(dburl, function (err, db) {
//     if (err) throw err;
//     console.log("Database created!");
//     const dbo = db.db("botti");
//     dbo.createCollection("customers", function (err, res) {
//         if (err) throw err;
//         console.log("Collection created!");
//         db.close();
//     });
// });

let mongoDB, bottiDB;

async function initializeDB() {
    mongoDB = await mongoClient.connect(dburl)

    bottiDB = mongoDB.db("botti");
}

initializeDB()



require(`./handler/command.js`)(client);

client.on('ready', async () => {

    //client.api.applications(client.user.id).guilds("492426074396033035").commands().get().then(answer => { console.log(answer) })
    //client.api.applications(client.user.id).guilds("492426074396033035").commands("806851986750308412").delete().then(answer => {console.log(answer)})

    client.user.setPresence({ activity: { name: "/play", type: "PLAYING" }, status: "online" })
    console.log("ONLINE!");

    const { sendUpdateMessage } = require(`${__dirname}/handler/updateFile.js`);
    sendUpdateMessage(client);

    if (process.env.REGISTER_COMMANDS) registerCommands();

});
client.ws.on('INTERACTION_CREATE', async interaction => {
    const commandName = interaction.data.name.toLowerCase();
    let command = client.commands.get(commandName);
    const args = interaction.data.options;

    if (true) {
        // here you could do anything. in this sample
        // i reply with an api interaction
        //command.run(client, msg, args);

        command.run(client, interaction, args);
    }
});

client.on('message', async (msg) => {
    if (msg.author.bot)
        return;
    if (!msg.guild)
        return;
    if (msg.author.id != client.user.id && msg.content.toLowerCase().match("(e|ä)h?r(e|ä)")) {
        ehre(msg);
    }
    if (msg.author.id != client.user.id && msg.content.toLowerCase().includes('alla')) {
        alla(msg);
    }
    if (msg.content.toLowerCase().match(/([y][e]{2,}[t])/gi)) {
        yeet(msg);
    }
    if (msg.content.toLowerCase().includes('tenor.com/view/laughing-big-mouth-eat-screaming-crazy-gif-12904194')) {
        msg.delete({ timeout: 1 })
            .then(msg => console.log(`Deleted message from ${msg.author.username} after 1 second`))
            .catch(console.error);
    }

    let parsedGold = goldJson;
    const authorId = msg.author.id;
    if (parsedGold[authorId] && !msg.content.startsWith("</")) {

        let lastTime = parsedGold[authorId].time;
        console.log("Last time: " + !Math.floor((new Date() - new Date(lastTime)) / 1000) < 60);

        if (!(Math.floor((new Date() - new Date(lastTime)) / 1000) < 600)) {
            console.log("haaaaaaaaaaaaaaaalllllllllllllllooooooooooooooooooooooooooooooooo :)");
            const db = admin.firestore()
            const docRef = db.doc(`bot/${authorId}`)
            const increaseBy = admin.firestore.FieldValue.increment(20);
            docRef.update({ coins: increaseBy });

            parsedGold[authorId].time = new Date();
        }

        fs.writeFileSync(pathString, JSON.stringify(parsedGold));

    } else if (!msg.content.startsWith("</") && !goldJson[authorId]) {
        console.log("else if 1");
        parsedGold[authorId] = { time: new Date() };
        fs.writeFileSync(pathString, JSON.stringify(parsedGold));
    }

    // If msg.member is uncached, cache it.
    if (!msg.member) msg.member = await msg.guild.fetchMember(msg);

});

function ehre(msg) {
    updateStat("ehre", msg, `{newStat} Ehre generiert :ok_hand:`);
}

function alla(msg) {
    updateStat("alla", msg, `Es wurde schon {newStat} mal alla gesagt!`);
}
async function yeet(msg) {

    yeeterId = msg.author.id;
    const collectionName = "yeet";
    try {
        const result = await bottiDB.collection(collectionName).findOne({ yeeter: yeeterId })
        let currStat;
        if (result) {
            currStat = result.value
        } else {
            currStat = 0;
        }
        let newStat = currStat + 1;

        let myobj = { $set: { value: newStat } };



        await bottiDB.collection(collectionName).updateOne({ "yeeter": yeeterId }, myobj, { upsert: true })

        msg.channel.send(`<@${yeeterId}> hat sich schon ${newStat} mal weggeyeetet!`);
    } catch (e) { console.warn(e) };

}

async function updateStat(stat, msg, statMessage, increaseAmount = 1) {
    const collectionName = stat;
    const id = msg.author.id;
    try {
        const result = await bottiDB.collection(collectionName).findOne({ id: id })
        let currStat = result ? result.value : 0;
        let newStat = currStat + increaseAmount

        let myobj = { $set: { value: newStat } };

        await bottiDB.collection(collectionName).updateOne({ id: id }, myobj, { upsert: true })


        await msg.channel.send(statMessage.replace("{newStat}", newStat));
    } catch (e) { console.warn(e) };
}

function registerCommands() {
    // Filter so we only have .js command files
    const commands = readdirSync(`${__dirname}/commands/`).filter(file => file.endsWith(".js"));

    // Loop over the commands, and add all of them to a collection
    // If there's no name found, prevent it from returning an error,
    // By using a cross in the table we made.
    console.log(`→ ${commands.length} commands found`)
    for (let file of commands) {
        let pull = require(`${__dirname}/commands/${file}`);

        if (pull.name) {
            client.api.applications(client.user.id).guilds("492426074396033035").commands.post({
                data: {
                    name: pull.name,
                    description: pull.description,
                    options: pull.options
                    // possible options here e.g. options: [{...}]
                }
                //client.user.setActivity(`New Game: [--play]!`)
            })
            //console.log(pull.name)
        } else {
            continue;
        }

        // If there's an aliases key, read the aliases.
        //if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
    }
}


client.login(config.token);

process.on("SIGINT", (signal) => {
    db.close();
    client.user.setStatus("idle").then(() => { // ?
        console.log("SIGINT exiting")
        process.exit(0)
    })
})
