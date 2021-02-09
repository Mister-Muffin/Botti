const Discord = require('discord.js');
const fs = require('fs');
const admin = require('firebase-admin');
const serviceAccount = require('./ServiceAccountKey.json');
const path = require('path');
const pathString = `${path.resolve(__dirname, '.')}/data/gold.json`;
const goldJson = require(pathString);
const { readdirSync } = require("fs");
const { parse } = require('path');
const { auth } = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const docRef = db.doc('bot/ehre');
const docRefAlla = db.doc('bot/alla');
const docRefYeet = db.doc('bot/yeet');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
var currEhre = 0;
var currAlla = 0;
var currYeet = 0;
var lukasKrasseEuroEtoroVerdiensteMitEhreInklusiveAufEhrenbasis = "YAMAN!";
lukasKrasseEuroEtoroVerdiensteMitEhreInklusiveAufEhrenbasis = lukasKrasseEuroEtoroVerdiensteMitEhreInklusiveAufEhrenbasis;
require(`./handler/command.js`)(client);

client.on('ready', async () => {

    //client.api.applications(client.user.id).guilds("492426074396033035").commands().get().then(answer => { console.log(answer) })
    //client.api.applications(client.user.id).guilds("492426074396033035").commands("806851986750308412").delete().then(answer => {console.log(answer)})

    client.user.setPresence({ activity: { name: "/play", type: "PLAYING" }, status: "online" })

    console.log("ONLINE!");
    // Filter so we only have .js command files
    const commands = readdirSync(`./commands/`).filter(file => file.endsWith(".js"));

    // Loop over the commands, and add all of them to a collection
    // If there's no name found, prevent it from returning an error,
    // By using a cross in the table we made.
    console.log(commands.length)
    for (let file of commands) {
        let pull = require(`./commands/${file}`);

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
    // client.api.applications(client.user.id).guilds("492426074396033035").commands.post({
    //     data: {
    //         name: "dujfqgzcwurgq9abdy",
    //         description: "hello world command"
    //         // possible options here e.g. options: [{...}]
    //     }
    //     //client.user.setActivity(`New Game: [--play]!`)
    // })
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
    if (!msg.content.startsWith(config.prefix)) {
        if (msg.author.id != client.user.id && msg.content.toLowerCase().match("(e|ä)h?r(e|ä)")) {
            ehre(msg);
        }
        if (msg.author.id != client.user.id && msg.content.toLowerCase().includes('alla')) {
            alla(msg);
        }
        if (msg.content.toLowerCase().match(/([y][e]{2,}[t])/gi)) {
            yeet(msg);
        }
    }
    if (msg.content.toLowerCase().includes('https://tenor.com/view/laughing-big-mouth-eat-screaming-crazy-gif-12904194') || msg.content.toLowerCase().includes('http://tenor.com/view/laughing-big-mouth-eat-screaming-crazy-gif-12904194')) {
        msg.delete({ timeout: 1 })
            .then(msg => console.log(`Deleted message from ${msg.author.username} after 5 seconds`))
            .catch(console.error);
    }

    var parsedGold = goldJson;
    const authorId = msg.author.id;
    if (parsedGold[authorId] && !msg.content.startsWith("</")) {
        console.log("if m ain");

        var lastTime = parsedGold[authorId].time;
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
    if (!msg.member)
        msg.member = await msg.guild.fetchMember(msg);
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0)
        return;
    if (!msg.content.startsWith(config.prefix)) {
        return;
    }
    let command = client.commands.get(cmd);
    // If none is found, try to find it by alias
    if (!command)
        command = client.commands.get(client.aliases.get(cmd));
    // If a command is finally found, run the command
    if (command)
        command.run(client, msg, args);
});
function ehre(msg) {
    docRef.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such doc!');
                return;
            }
            currEhre = doc.data().ehre;
        })
        .then(function () {
            docRef.set({
                ehre: currEhre + 1
            }).then(function () {
                //console.log('done!')
                msg.channel.send(`${currEhre + 1} Ehre generiert :ok_hand:`);
            }).catch(error => {
                console.log(error);
            });
        }).catch(error => {
            console.log(error);
        });
}
function alla(msg) {
    docRefAlla.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such doc!');
                return;
            }
            currAlla = doc.data().alla;
        })
        .then(function () {
            docRefAlla.set({
                alla: currAlla + 1
            }).then(function () {
                //console.log('done!')
                msg.channel.send(`Es wurde schon ${currAlla + 1} mal alla gesagt!`);
                console.log(currAlla);
                console.log(currAlla + 1);
            }).catch(error => {
                console.log(error);
            });
        }).catch(error => {
            console.log(error);
        });
}
function yeet(msg) {
    yeeterId = msg.author.id;
    docRefYeet.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such doc!');
                return;
            }

            currYeet = doc.data()[yeeterId];
        })
        .then(function () {
            if (isNaN(currYeet)) {
                currYeet = 0;
                console.log("NotANumber");
            }
            docRefYeet.update({
                [yeeterId]: currYeet + 1
            }).then(function () {
                //console.log('done!')
                msg.channel.send(`<@${yeeterId}> hat sich schon ${currYeet + 1} mal weggeyeetet!`);
                //console.log(currYeet);
                //console.log(currYeet + 1);
            }).catch(error => {
                console.log(error);
            });
        }).catch(error => {
            console.log(error);
        });
}
client.login(config.token);

process.on("SIGINT", (signal) => {
    client.user.setStatus("idle").then(() => { // ?
        console.log("SIGINT exiting")
        process.exit(0)
    })
})
