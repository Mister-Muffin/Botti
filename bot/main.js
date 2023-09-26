checkArgs();

import { load } from "dotenv";

const env = await load({
    envPath: "../.env",
});

import { Client, Collection, Events, IntentsBitField } from "discord.js";

import { incrementValueFromUserId } from "./postgres.js";

import pg from "pg";
export const dbclient = new pg.Client({ //export
    user: env["DB_USER"],
    host: env["DB_IP"],
    database: env["DB_DB"],
    password: env["DB_PASS"],
    port: env["DB_PORT"] ? env["DB_PORT"] : 5432,
});

const myIntents = new IntentsBitField();
myIntents.add(
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
);

// global.appRoot__ObhsaaU = path.resolve(import.meta.url);
const client = new Client({ intents: myIntents });
client.commands = new Collection();
client.aliases = new Collection();
let lukasKrasseEuroEtoroVerdiensteMitEhreInklusiveAufEhrenbasis = "YAMAN!";
// deno-lint-ignore no-self-assign
lukasKrasseEuroEtoroVerdiensteMitEhreInklusiveAufEhrenbasis = lukasKrasseEuroEtoroVerdiensteMitEhreInklusiveAufEhrenbasis;

const pathString = `data/gold.json`;
let goldJson;
try {
    goldJson = Deno.readFileSync(pathString);
} catch (e) {
    console.warn(e);
    Deno.writeTextFileSync(pathString, JSON.stringify({}));
    goldJson = Deno.readFileSync(pathString);
}

async function initializeDB() {
    await dbclient.connect();
    console.log("Successfully connected to Database");
}
initializeDB();

import command from "./handler/command.js";
command(client);

client.on("ready", async () => {
    if (env["REGISTER_COMMANDS"]) require("./handler/registerCommand.cjs");

    await client.user.setPresence({ activities: [{ name: "/play", type: "PLAYING" }], status: "online" });
    console.log("ONLINE!");
});

client.on(Events.InteractionCreate, async (interaction) => {
    // Not every interaction is a slash command (e.g. MessageComponents).
    // Only receive slash commands by making use of the BaseInteraction#isChatInputCommand() method
    if (!interaction.isChatInputCommand()) return;

    const commandName = interaction.commandName.toLowerCase();
    const command = interaction.client.commands.get(commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return await interaction.reply({ content: ":x: This command was not found!", ephemeral: true });
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
});

client.on("messageCreate", async (msg) => {
    if (msg.author.bot) {
        return;
    }
    if (!msg.guild) {
        return;
    }
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
                .then((msg) => console.log(`Deleted message from ${msg.author.username} after 1 second`))
                .catch(console.error);
        }, 1000);
    }

    const parsedGold = goldJson;
    const authorId = msg.author.id;

    if (parsedGold[authorId] && !msg.content.startsWith("</")) {
        const lastTime = parsedGold[authorId].time;
        // console.log("Last time: " + !Math.floor((new Date() - new Date(lastTime)) / 1000) < 60);

        if (!(Math.floor((new Date() - new Date(lastTime)) / 1000) < 60)) {
            try {
                //Check if user exists
                const userArray = (await dbclient.query('SELECT "UserId" FROM users')).rows;
                if (userArray.filter((object) => object.UserId == authorId).length < 1) {
                    dbclient.query(`INSERT INTO users("UserId") VALUES (${authorId});`);
                }
                //
                await dbclient.query(
                    `UPDATE users SET "Username" = '${msg.author.username}' WHERE "UserId" = ${authorId}`,
                );
                //
                await incrementValueFromUserId(dbclient, "Coins", 2, authorId);
                await incrementValueFromUserId(dbclient, "Xp", Math.random() * (10) + 15, authorId);

                parsedGold[authorId].time = new Date();
            } catch (e) {
                console.warn(e);
            }
        }

        fs.writeFileSync(pathString, JSON.stringify(parsedGold));
    } else if (!msg.content.startsWith("</") && !goldJson[authorId]) {
        console.log("else if 1");
        parsedGold[authorId] = { time: new Date() };
        fs.writeFileSync(pathString, JSON.stringify(parsedGold));
    }

    await incrementValueFromUserId(dbclient, "Messages", 1, authorId); // increase message counter every time a user sent a message

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

            await msg.channel.send({ content: statMessage.replace("{newStat}", parseInt(val) + 1) });
        }
    } catch (e) {
        console.warn(e);
    }
}

client.login(env["TOKEN"]);

Deno.addSignalListener("SIGINT", async () => {
    try {
        await client.destroy();
        await dbclient.end();
        console.log("\nConnection closed.");
    } finally {
        console.log("SIGINT exiting");
        Deno.exit(0);
    }
});

/* eslint-disable indent */
function checkArgs() {
    const myArgs = Deno.args.slice(2);
    switch (myArgs[0]) {
        case "--register":
            require("./handler/registerCommand.cjs");
            console.info("Registered commands. Exiting.");
            break;
        case "--delete":
            require("./handler/deleteCommands.cjs");
            console.info("Deleted commands. Exiting.");
            break;
        default:
    }
}
