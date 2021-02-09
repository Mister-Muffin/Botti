const fs = require('fs')
const Embed = require('../embed.js')
module.exports = {
  name: "help",
  description: "Helo, im under de water, please help me!",
  options: [],
  run: async (client, interaction, args) => {
    try {
      Embed.help(`${fs.readFileSync('commands/help.md', 'utf8')}`, client, interaction)
    } catch (e) {
      Embed.error(`
      :x: Es ist ein Fehler aufgetreten!
      Bitte einen Admin um Hilfe!`, client, interaction)
      console.log(e);
    }

  }
}
