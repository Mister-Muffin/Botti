const { readdirSync } = require("fs");
const ascii = require("ascii-table");
const path = require('path');

const appDir = path.dirname(require.main.filename);

// Create a new Ascii table
let table = new ascii("Commands");
table.setHeading("Command", "Load status");

module.exports = (client) => {
    // Read every commands subfolder
    readdirSync(`${appDir}/commands/`).forEach(dir => {
        // Filter so we only have .js command files
        const commands = readdirSync(`${appDir}/commands/`).filter(file => file.endsWith(".js"));

        // Loop over the commands, and add all of them to a collection
        // If there's no name found, prevent it from returning an error,
        // By using a cross in the table we made.
        for (let file of commands) {
            let pull = require(`${appDir}/commands/${file}`);

            if (pull.name) {
                client.commands.set(pull.name, pull);
                
                table.addRow(file, '✅');
            } else {
                table.addRow(file, `❌  -> missing a help.name, or help.name is not a string.`);
                continue;
            }

            // If there's an aliases key, read the aliases.
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });
    // Log the table
    //console.log(table.toString());
    console.log('table loaded')
}

/**
 * This is the basic command layout
 * module.exports = {
 *  name: "Command name",
 *  aliases: ["array", "of", "aliases"]
 *  category: "Category name",
 *  description: "Command description"
 *  usage: "[args input]",
 *  run: (client, message, args) => {
 *      The code in here to execute
 *  }
 * }
 */
