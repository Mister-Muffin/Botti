import { error, help } from "../embed.mjs";
export const name = "help";
export const description = "Helo, im under de water, please help me!";
export const options = [];
export async function run(client, interaction, args) {
    try {
        help(`${Deno.readFileSync("commands/help.txt", "utf8")}`, client, interaction);
    } catch (e) {
        error(
            `
      :x: Es ist ein Fehler aufgetreten!
      Bitte einen Admin um Hilfe!`,
            client,
            interaction,
        );
        console.log(e);
    }
}
