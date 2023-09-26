import { dirname } from "path";
import { SlashCommandBuilder } from "discord.js";
const appDir = dirname(import.meta.url);

export const data = new SlashCommandBuilder()
    .setName("coins")
    .setDescription("zeigt dir deinen aktuellen Kontostand an");
export async function execute(interaction) {
    const { dbclient } = require(`${appDir}/main.cjs`);
    const { getValueFromUserId } = require(`${appDir}/postgres.cjs`);

    const authorId = interaction.member.user.id;
    const coins = (await getValueFromUserId(dbclient, "Coins", authorId)).Coins;

    await interaction.reply(`${interaction.member.nickname}, du hast ${coins} Geld :moneybag:`);
}
