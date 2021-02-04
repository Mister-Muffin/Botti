const Embed = require('../embed.js')
var debugMode = false
exports.debugMode = debugMode
module.exports = {
    name: "debug",
    description: "EHRE!",
    options: [],
    run: async (client, message, args) => {
        if (debugMode) {
          debugMode = false
          Embed.warning('Debug messages disabled', message.channel)
        } else {
          debugMode = true;
          Embed.warning('Debug messages enabled', message.channel)
        }
    }
}
