const path = require("path");
const {SlashCommandBuilder} = require("discord.js");
const appDir = path.dirname(require.main.filename);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("schaufel")
        .setDescription("Haue dir oder jemand anderen eine Schaufel an dem Kopf.")
        .addUserOption(option => option.setName("user").setDescription("Andere Person").setRequired(false)),
    async execute(interaction) {

        try {
            const { incrementValueFromUserId } = require(`${appDir}/postgres.js`);
            const { dbclient: dbClient } = require(`${appDir}/main.js`);

            const user = interaction.options.getUser("user", false) || interaction.member.user.id;

            await incrementValueFromUserId(dbClient, "Schaufel", 1, user);
            const schaufeln = (await dbClient.query("SELECT SUM(\"Schaufel\") FROM users")).rows[0].sum;


            if (interaction.options.getUser("user", false) != null) { // if a user was specified mention the user in the response
                await interaction.reply(`* Schaufel an <@!${user}>'s Kopf! *\n${schaufeln} Schaufeln wurden schon gegen Köpfe gehauen.`);

            } else {
                await interaction.reply(`* Schaufel an den Kopf! *\n${schaufeln} Schaufeln wurden schon gegen Köpfe gehauen.`);
            }
        } catch (e) { console.warn(e); }
    }
};
