import { SlashCommandBuilder } from "discord.js";
import { dbclient } from "../main.mjs";
import { getValueFromUserId } from "../postgres.mjs";

export const data = new SlashCommandBuilder()
    .setName("coins")
    .setDescription("zeigt dir deinen aktuellen Kontostand an");
export async function execute(interaction) {
    const authorId = interaction.member.user.id;
    const coins = (await getValueFromUserId(dbclient, "Coins", authorId)).Coins;

    await interaction.reply(`${interaction.member.nickname}, du hast ${coins} Geld :moneybag:`);
}
