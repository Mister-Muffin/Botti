const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stop this Bot (Limited usage)"),
    async execute(interaction) {

        if (interaction.member.user.id === "443872816933240833") {
            await interaction.reply(":octagonal_sign: Stopping Botti...", interaction.client);
            // eslint-disable-next-line no-undef

            process.kill(process.pid, "SIGINT");
        } else {
            //TODO: maybe use error embed
            await interaction.reply(":x: Du darfst den Befehl leider nicht ausführen!");
        }

    }
};