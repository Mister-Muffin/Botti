import { SlashCommandBuilder } from "discord.js";
import { incrementValueFromUserId } from "../postgres.mjs";
import { dbclient as dbClient } from "../main.mjs";

export const data = new SlashCommandBuilder()
    .setName("schaufel")
    .setDescription("Haue dir oder jemand anderen eine Schaufel an dem Kopf.")
    .addUserOption((option) => option.setName("user").setDescription("Andere Person").setRequired(false));
export async function execute(interaction) {
    try {
        const user = interaction.options.getUser("user", false) || interaction.member.user.id;

        await incrementValueFromUserId(dbClient, "Schaufel", 1, user);
        const schaufeln = (await dbClient.query('SELECT SUM("Schaufel") FROM users')).rows[0].sum;

        if (interaction.options.getUser("user", false) != null) { // if a user was specified mention the user in the response
            await interaction.reply(
                `* Schaufel an <@!${user}>'s Kopf! *\n${schaufeln} Schaufeln wurden schon gegen Köpfe gehauen.`,
            );
        } else {
            await interaction.reply(
                `* Schaufel an den Kopf! *\n${schaufeln} Schaufeln wurden schon gegen Köpfe gehauen.`,
            );
        }
    } catch (e) {
        console.warn(e);
    }
}
