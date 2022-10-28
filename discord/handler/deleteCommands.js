const { REST, Routes } = require("discord.js");
const { token } = require("../../config.json");

const rest = new REST({ version: "10" }).setToken(token);

rest.put(Routes.applicationCommands("493003865537511436"), { body: [] })
    .then(() => console.log("Successfully deleted all application commands."))
    .catch(console.error);