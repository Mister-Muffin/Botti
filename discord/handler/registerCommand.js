const { REST, Routes } = require("discord.js");
const { token } = require("../../config.json");
const { readdirSync } = require("fs");
const path = require("path");

const appDir = path.dirname(require.main.filename).replace("handler", "");

const clientId = "493003865537511436";
const guildId = "492426074396033035";


const commands = readdirSync(`${appDir}/commands/`).filter(file => file.endsWith(".js"));
const commandList = [];

for (let file of commands) {
    try {
        let command = require(`${appDir}/commands/${file}`).data.toJSON();

        commandList.push(command);
    } catch (e) {
        console.warn(file, "Command skipped. Not implemented.", e.message);
    }

}

//

const rest = new REST({ version: "10" }).setToken(token);
(async () => {
    try {
        let data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandList });
        console.log(`Successfully registered ${data.length} application commands.`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();