const Embed = require('../embed.js')
const {
  MessageEmbed
} = require('discord.js')
module.exports = {
  name: "clear",
  run: async (client, message, args) => {
    if (!args[0]) return
    if (args[0] < 1 || args[0] > 99) return
    message.channel.bulkDelete(args[0], true).then(async msgs => {

      const emb = new MessageEmbed()
        .setColor(0x2ecc71)
        .setDescription(`${msgs.size} Nachichten gelöscht`)

      message.channel.send('', emb).then(async deleteMsg => {
        console.log(`${deleteMsg}********`)
        setTimeout(() => {
          deleteMsg.delete()
        }, 2000)
      }).catch(err => {
        console.log(err)
      })

    }).catch(err => {
      console.log(err)
    })

  }
}
