const {SlashCommandBuilder} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("pong")
        .setDescription("pong!"),
    async execute (interaction) {
        console.log(interaction.channel);

        await interaction.reply("🏓 Ping!");

    }
};