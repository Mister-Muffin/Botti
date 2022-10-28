const { SlashCommandBuilder } = require("discord.js");
let ping = NaN;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("pong!"),
    async execute(interaction) {
        console.log(interaction.channel);

        await interaction.reply("Pinging...");

        ping = Date.now() - interaction.createdAt;

        await interaction.editReply(`🏓 Pong! (Latency is ${ping}ms. API Latency is ${Math.round(interaction.client.ws.ping)}ms)`);

    }
};