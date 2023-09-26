import ascii from "ascii-table";
import { commands } from "./commandTable.js";

const appDir = "bot";
console.log("Appdir: " + appDir);

// Create a new Ascii table
let table = new ascii("Commands");
table.setHeading("Command", "Load status");

export default (client) => {
    // Loop over the commands, and add all of them to a collection
    // If there's no name found, prevent it from returning an error,
    // By using a cross in the table we made.
    for (let command of commands) {
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
    // Log the table
    console.log(table.toString());
    console.log("table loaded");
};

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
