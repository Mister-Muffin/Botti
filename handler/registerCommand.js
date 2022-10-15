const { REST, SlashCommandBuilder, Routes } = require("discord.js");
const { token } = require("../config.json");

const clientId = "493003865537511436";
const guildId = "492426074396033035";

const commands = [
    require("../commands/ping.js").data.toJSON(),
];
//

const rest = new REST({ version: "10" }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
    .catch(console.error);