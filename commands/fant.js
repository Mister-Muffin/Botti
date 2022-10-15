const { SlashCommandBuilder } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("fant")
        .setDescription(":fant:"),
    async execute (interaction) {

        await interaction.reply("fant\n<:fant:806252665180520516>");
        
    }
};