const { readdirSync } = require("fs");
const ascii = require("ascii-table");
const path = require("path");

const appDir = path.dirname(require.main.filename);
console.log("Appdir: " + appDir);

// Create a new Ascii table
let table = new ascii("Commands");
table.setHeading("Command", "Load status");

module.exports = (client) => {
    // Import all root level commands
    importCommands(`${appDir}/commands/`, client);

    // Read every commands subfolder
    readdirSync(`${appDir}/commands/`, { withFileTypes: true, recursive: false }).forEach(file => {
        if (!file.isDirectory()) return;
        importCommands(`${appDir}/commands/${file.name}`, client);
    });

    // Log the table
    console.log(table.toString());
    console.log("table loaded");
};

function importCommands(path, client) {
    // Filter so we only have .js command files
    const commands = readdirSync(path).filter(file => file.endsWith(".cjs"));

    // Loop over the commands, and add all of them to a collection
    // If there's no name found, prevent it from returning an error,
    // By using a cross in the table we made.
    for (let file of commands) {
        let command = require(`${appDir}/commands/${file}`);
        try {
            command.data;

            client.commands.set(command.data.name, command);

            if (command.data.name) {
                client.commands.set(command.name, command);

                table.addRow(file, "✅");
            } else {
                table.addRow(file, "❌  -> missing a help.name, or help.name is not a string.");
            }
        } catch (e) {
            console.warn("Command skipped. Not implemented");
        }

    }
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
