const fs = require('fs')
const Embed = require('../embed.js')
module.exports = {
  name: "help",
  run: async (client, message, args) => {
    try {
    Embed.help(`${fs.readFileSync('commands/help.md', 'utf8')}`, message.channel)
    } catch (e) {
      Embed.error(`
      :x: Es ist ein Fehler aufgetreten!
      Bitte einen Admin um Hilfe!`, message.channel)
      console.log(e);
    }

  }
}
