import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { dirname } from "path";
const appDir = dirname(import.meta.url);
const colors = {
    red: 0xe74c3c,
    yellow: 0xf1c40f,
    green: 0x2ecc71,
    purple: 0x8e44ad,
    cyan: 0x0fcedb,
};

const price = 50;

export const data = new SlashCommandBuilder()
    .setName("play")
    .setDescription("startet das Spiel!");
export async function execute(interaction) {
    const { getValueFromUserId, incrementValueFromUserId } = require(`${appDir}/postgres.cjs`);
    const { dbclient } = require(`${appDir}/main.cjs`);
    const authorId = interaction.member.user.id;

    let coins = (await getValueFromUserId(dbclient, "Coins", authorId)).Coins;

    if (coins < price) {
        const emb = new EmbedBuilder()
            .setColor(colors.red)
            .setDescription(`${interaction.member.nick}, du hast leider nicht genug Geld! (Du brauchst mindestens 50)`);
        await interaction.reply({ embeds: [emb] });
    } else {
        coins -= price;
        await incrementValueFromUserId(dbclient, "Coins", -price, authorId);

        //Roll!
        let items = [":watermelon:", ":apple:", ":banana:"];

        let first = [Math.floor(Math.random() * 3)];
        let second = [Math.floor(Math.random() * 3)];
        let third = [Math.floor(Math.random() * 3)];

        let emb;

        if (items[first] === items[second] && items[second] === items[third]) {
            coins += 400;
            await incrementValueFromUserId(dbclient, "Coins", 400, authorId);

            emb = new EmbedBuilder()
                .setColor(colors.green)
                .setTitle("Gewonnen!")
                .setDescription(
                    `Glückwunsch ${interaction.member.nickname}!\nDu hast gewonnen! :partying_face:\nDu hast jetzt ${coins} Geld.`,
                );
        } else {
            emb = new EmbedBuilder()
                .setColor(colors.red)
                .setTitle("Verloren!")
                .setDescription(
                    `Schade ${interaction.member.nickname}.\nViel Glück beim nächsten mal!\nDu hast noch ${coins} Geld`,
                );
        }
        await interaction.reply(`${items[first]} ${items[second]} ${items[third]}`);

        await interaction.channel.send({ embeds: [emb] });
    }
}
