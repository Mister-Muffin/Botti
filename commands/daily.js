const path = require('path');
const { createAPIMessage } = require('../embed');

const appDir = path.dirname(require.main.filename);
const collectionName = "coins";

module.exports = {
    name: "daily",
    description: "Hole deine täglichen Münzen.",
    options: [],
    run: async (client, interaction, args) => {

        const authorId = interaction.member.user.id;
        const { bottiDB } = require(`${appDir}/main.js`);

        const result = await bottiDB.collection(collectionName).findOne({ id: authorId })
        let lastTime = result ? result.lastTime : new Date();

        console.log("Last time: " + date_diff_indays(lastTime, new Date()));

        if (date_diff_indays(lastTime, new Date()) < 1) {
            await rejectBonus(interaction, client);
        } else {
            await giveBonus(interaction, client, date_diff_indays(lastTime, new Date()));
        }
    }
};

async function giveBonus(interaction, client, days = 1) {
    const authorId = interaction.member.user.id;

    let coins = 0
    for (let i = 0; i < days; i++) {
        coins += 200 * Math.pow(0.5, i)
    }

    try {
        const { bottiDB } = require(`${appDir}/main.js`);

        const result = await bottiDB.collection(collectionName).findOne({ id: authorId })
        let currStat = result ? result.value : 0;
        let newStat = currStat + Math.round(coins);

        let myobj = { $set: { value: newStat, lastTime: new Date() } };

        await bottiDB.collection(collectionName).updateOne({ id: authorId }, myobj, { upsert: true })


    } catch (e) { console.warn(e) };

    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: await createAPIMessage(interaction, `:moneybag: Du hast deine täglichen Münzen bekommen, Ehre!`, client)
        }
    });
}

async function rejectBonus(interaction, client) {

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