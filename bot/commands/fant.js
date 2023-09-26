import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder()
    .setName("fant")
    .setDescription(":fant:");
export async function execute(interaction) {
    await interaction.reply("fant\n<:fant:806252665180520516>");
}
