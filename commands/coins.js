const path = require("path");
const {SlashCommandBuilder} = require("discord.js");
const appDir = path.dirname(require.main.filename);


module.exports = {
    data: new SlashCommandBuilder()
        .setName("coins")
        .setDescription("zeigt dir deinen aktuellen Kontostand an"),
    async execute(interaction) {

        const { dbclient } = require(`${appDir}/main.js`);
        const { getValueFromUserId } = require(`${appDir}/postgres.js`);

        const authorId = interaction.member.user.id;
        const coins = (await getValueFromUserId(dbclient, "Coins", authorId)).Coins;

        await interaction.reply(`${interaction.member.nickname}, du hast ${coins} Geld :moneybag:`);

    }
};