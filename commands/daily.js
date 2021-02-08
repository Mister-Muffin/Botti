// const Embed = require("../embed.js");

const path = require('path');
const pathString = `${path.resolve(__dirname, '..')}/data/gold.json`;

const goldJson = require(pathString);
const Discord = require("discord.js");
const fs = require('fs');
const mkdirp = require('mkdirp');
const admin = require('firebase-admin');

module.exports = {
    name: "daily",
    description: "Hole deinen täglichen coin Bonus.",
    options: [],
    run: async (client, interaction, args) => {

        const authorId = interaction.member.user.id;

        var parsedGold = goldJson;

        if (!parsedGold[authorId]) {
            parsedGold[authorId] = { daily: new Date() };
            await giveBonus(interaction, client, parsedGold);
            console.log("if")
        } else if (parsedGold[authorId].daily) {

            var lastTime = parsedGold[authorId].daily;
            console.log("Last time: " + date_diff_indays(lastTime, new Date()));

            if (date_diff_indays(lastTime, new Date()) < 1) {

                await rejectBonus(interaction, client, parsedGold);

            } else {

                await giveBonus(interaction, client, parsedGold, date_diff_indays(lastTime, new Date()));

            }

            console.log("Else if")

        } else {
            console.log(parsedGold[authorId]);
            parsedGold[authorId].daily = new Date();
            console.log("Else")
            // await giveBonus(interaction, client);
            fs.writeFileSync(pathString, JSON.stringify(parsedGold));
        }

    }
};

async function giveBonus(interaction, client, parsedGold, days = 1) {
    const authorId = interaction.member.user.id;

    var coins = 0
    for (var i = 0; i < days; i++) {
        coins += 200 * Math.pow(0.5, i)
    }

    const db = admin.firestore()
    const docRef = db.doc(`bot/${authorId}`)
    const increaseBy = admin.firestore.FieldValue.increment(Math.round(coins));
    docRef.update({ coins: increaseBy });

    parsedGold[authorId].daily = new Date();

    fs.writeFileSync(pathString, JSON.stringify(parsedGold));

    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: await createAPIMessage(interaction, `:moneybag: Du hast deine täglichen Münzen bekommen, Ehre!`, client)
        }
    });
}

async function rejectBonus(interaction, client, parsedGold) {

    fs.writeFileSync(pathString, JSON.stringify(parsedGold));

    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: await createAPIMessage(interaction, `:x: Du kannst deine täglichen Münzen noch nicht abholen, versuch es morgen noch einmal!`, client)
        }
    });
}

const date_diff_indays = function (date1, date2) {
    const dt1 = new Date(date1);
    const dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
}

async function createAPIMessage(interaction, content, client) {
    const apiMessage = await Discord.APIMessage.create(client.channels.resolve(interaction.channel_id), content)
        .resolveData()
        .resolveFiles();

    return { ...apiMessage.data, files: apiMessage.files };
}
