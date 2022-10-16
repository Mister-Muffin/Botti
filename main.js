const { Client, IntentsBitField, Collection} = require("discord.js");

const dotenv = require("dotenv");
dotenv.config();

const { incrementValueFromUserId } = require("./postgres.js");

const { Client: PgClient } = require("pg");
const dbclient = new PgClient({ //export
    user: process.env.DB_USER,
    host: process.env.DB_IP,
    database: process.env.DB_DB,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT ? process.env.DB_PORT : 5432
});
module.exports.dbclient = dbclient;

const myIntents = new IntentsBitField();
myIntents.add(
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
);

const fs = require("fs");
const { readdirSync } = require("fs");
const path = require("path");
const appDir = path.dirname(require.main.filename);
const client = new Client({ intents: myIntents });
client.commands = new Collection();
client.aliases = new Collection();
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

async function initializeDB() {
    await dbclient.connect();
    console.log("Successfully connected to Database");
}
initializeDB();


require("./handler/command.js")(client);

client.on("ready", async () => {

    if (process.env.REGISTER_COMMANDS) require("./handler/registerCommand.js");

    await client.user.setPresence({activities: [{name: "/play", type: "PLAYING"}], status: "online"});
    console.log("ONLINE!");

});

client.on("interactionCreate", async interaction => {
    // not every interaction is a slash command (e.g. MessageComponents).Only receive slash commands by making use of the BaseInteraction#isChatInputCommand() method
    if (!interaction.isChatInputCommand()) return;
    const commandName = interaction.commandName.toLowerCase();
    let command = interaction.client.commands.get(commandName);

    command.execute(interaction);
});

client.on("messageCreate", async (msg) => {
    if (msg.author.bot)
        return;
    if (!msg.guild)
        return;
    if (msg.content.toLowerCase().match("(e|ä)h?r(e|ä)")) {
        ehre(msg);
    }
    if (msg.content.toLowerCase().includes("alla")) {
        alla(msg);
    }
    if (msg.content.toLowerCase().match(/([y][e]{2,}[t])/gi)) {
        yeet(msg);
    }
    if (msg.content.toLowerCase().includes("tenor.com/view/laughing-big-mouth-eat-screaming-crazy-gif-12904194")) {
        setTimeout(() => {
            msg.delete()
                .then(msg => console.log(`Deleted message from ${msg.author.username} after 1 second`))
                .catch(console.error);
        }, 1000);
    }

    let parsedGold = goldJson;
    const authorId = msg.author.id;
    if (parsedGold[authorId] && !msg.content.startsWith("</")) {

        let lastTime = parsedGold[authorId].time;
        // console.log("Last time: " + !Math.floor((new Date() - new Date(lastTime)) / 1000) < 60);

        if (!(Math.floor((new Date() - new Date(lastTime)) / 1000) < 600)) {
            try {
                //Check if user exists
                const userArray = (await dbclient.query("SELECT \"UserId\" FROM users")).rows;
                if (userArray.filter(object => object.UserId == authorId).length < 1) {
                    dbclient.query(`INSERT INTO users("UserId") VALUES (${authorId});`);
                }
                //
                await dbclient.query(`UPDATE users SET "Username" = '${msg.author.username}' WHERE "UserId" = ${authorId}`);
                //
                await incrementValueFromUserId(dbclient, "Coins", 20, authorId);

                parsedGold[authorId].time = new Date();

            } catch (e) { console.warn(e); }
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
    updateStat("Ehre", msg, "{newStat} Ehre generiert :ok_hand:");
}

function alla(msg) {
    updateStat("Alla", msg, "Es wurde schon {newStat} mal alla gesagt!");
}
function yeet(msg) {
    updateStat("Yeet", msg, "Du hast dich schon {newStat} mal weggeyeetet!");
}

async function updateStat(stat, msg, statMessage) {
    const id = msg.author.id;
    try {
        if (stat === "Yeet") {
            const result = await dbclient.query(`SELECT "${stat}" FROM users WHERE "UserId" = ${id}`);
            const val = result.rows[0].Yeet;

            await incrementValueFromUserId(dbclient, stat, 1, id);

            await msg.channel.send(statMessage.replace("{newStat}", parseInt(val) + 1));
        } else {
            const result = await dbclient.query(`SELECT SUM("${stat}") FROM users`);
            const val = result.rows[0].sum;

            await incrementValueFromUserId(dbclient, stat, 1, id);

            await msg.channel.send({content: statMessage.replace("{newStat}", parseInt(val) + 1)});
        }

    } catch (e) { console.warn(e); }
}


client.login(process.env.TOKEN);

process.on("SIGINT", async () => {
    try {
        await client.destroy();
        await dbclient.end();
        console.log("\nConnection closed.");
    }
    finally {
        console.log("SIGINT exiting");
        process.exit(0);
    }
});
