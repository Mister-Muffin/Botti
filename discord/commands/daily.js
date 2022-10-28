const path = require("path");

const appDir = path.dirname(require.main.filename);

const { getValueFromUserId, incrementValueFromUserId } = require(`${appDir}/postgres.js`);
const { dbclient } = require(`${appDir}/main.js`);
const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Hole deine täglichen Münzen."),
    async execute(interaction) {

        const authorId = interaction.member.user.id;

        const lastTime = (await getValueFromUserId(dbclient, "LastTime", authorId)).LastTime;

        console.log("Last time: " + dateDiffInDays(lastTime, new Date()));

        if (dateDiffInDays(lastTime, new Date()) < 1) {
            await rejectBonus(interaction);
        } else {
            await giveBonus(interaction, dateDiffInDays(lastTime, new Date()));
        }
    }
};

async function giveBonus(interaction, days = 1) {
    const authorId = interaction.member.user.id;

    let coins = 0;
    for (let i = 0; i < days; i++) {
        coins += 200 * Math.pow(0.5, i);
    }

    try {

        (await incrementValueFromUserId(dbclient, "Coins", coins, authorId));
        (await dbclient.query(`UPDATE users SET "LastTime" = NOW() WHERE "UserId" = ${authorId}`));

    } catch (e) { console.warn(e); }

    await interaction.reply(":moneybag: Du hast deine täglichen Münzen bekommen, Ehre!");

}

async function rejectBonus(interaction) {
    await interaction.reply(interaction, ":x: Du kannst deine täglichen Münzen noch nicht abholen, versuch es morgen noch einmal!");
}

const dateDiffInDays = function (date1, date2) {
    const dt1 = new Date(date1);
    const dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
};