var debug = false
module.exports = {
    name: "ping",
    run: async (client, message, args) => {
        Embed.error(":x: This command is currently unaviable!", message.channel)
        if (debugMode) {
          debugMode = false
          Embed.warning('Debug messages disabled')
        } else {
          debugMode = true;
          Embed.warning('Debug messages enabled')
        }
    }
}
