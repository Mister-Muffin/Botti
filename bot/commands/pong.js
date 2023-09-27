import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder()
    .setName("pong")
    .setDescription("pong!");
export async function execute(interaction) {
    console.log(interaction.channel);

    await interaction.reply("🏓 Ping!");
}
