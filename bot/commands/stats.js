import { access, constants, readFileSync, writeFileSync } from "fs";
import { dirname } from "path";
import { SlashCommandBuilder } from "discord.js";

const appDir = dirname(require.main.filename);
const pathString = `${appDir}/data/access.json`;

export const data = new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View Botti's server stats");
export async function execute(interaction) {
    let tokens = await new Promise((r) => access(pathString, constants.F_OK, (e) => r(!e)))
        ? JSON.parse(readFileSync(pathString, "utf8"))
        : [];

    const token = { "date": (new Date()).getTime(), "token": makeId(8) };
    tokens.push(token);

    writeFileSync(pathString, JSON.stringify(tokens));

    await interaction.reply(
        `Du kannst die Statistiken unter https://discord.schweininchen.de/botti/?token=${token.token} aufrufen.`,
    );
}

function makeId(length) {
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
