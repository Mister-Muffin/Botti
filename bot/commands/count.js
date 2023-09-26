import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder()
    .setName("count")
    .setDescription("EHRE!")
    .addNumberOption((option) =>
        option.setName("number").setDescription("Wie viel soll der Bot zählen? (max.100)").setRequired(true)
    );
export async function execute(interaction) {
    const number = interaction.options.getNumber("number", true);

    if (number > 100) {
        interaction.reply(
            `Ich glaube, dass ich noch nicht bis ${number} zählen kann.\nBitte versuch's nochmal mit einer kleineren Zahl :)`,
        );
        return;
    }

    await interaction.reply(`Jaaaa, lasst uns bis ${number} zählen!`);

    await countUp(1);

    async function countUp(num) {
        setTimeout(async function () {
            if (num === number + 1) {
                await interaction.channel.send("Endlich fertig!");
                return;
            }
            await interaction.channel.send(num.toString());
            await countUp(num + 1);
        }, 750);
    }
}
