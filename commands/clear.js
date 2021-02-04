const Embed = require('../embed.js')
const {
  MessageEmbed
} = require('discord.js')
module.exports = {
  name: "clear",
  description: "Löscht eine bestimmte Anzahl an Nachichten.!",
  options: [
    {
      "name": "number",
      "description": "Wie viele Nachichten der Bot löschen soll.",
      "type": 4,
      "required": true
  },
  ],
  run: async (client, interaction, args) => {
    console.log(interaction.member.permissions);
    client.channels.fetch(interaction.channel_id).then(async channel => {
    if (!args[0]) return
    if (args[0] < 1 || args[0] > 99) {
      channel.send('', new MessageEmbed()
      .setColor(0xff3300)
      .setDescription(`:x: **Du musst eine Zahl zwischen 1 und 99 angeben!**`));
      return;
    }
    // if (!interaction.member.permissions('MANAGE_MESSAGES')) {
    //   message.channel.send(`:x: Sorry ${message.author}, du hast nicht die nötigen Rechte!\nBitte einen Admin um Hilfe!`)
    //   return
    // }
    blockCommand(channel);
    return;
    
    channel.bulkDelete(args.find(arg => arg.name.toLowerCase() == "number").value, true).then(async msgs => {

      const emb = new MessageEmbed()
        .setColor(0x2ecc71)
        .setDescription(`${msgs.size} Nachichten gelöscht`)

      channel.send('', emb).then(async deleteMsg => {
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
    }).catch(console.error);
    

  }
}

function blockCommand(channel) {
  channel.send('', new MessageEmbed()
      .setColor(0xff9300)
      .setDescription(`:warning: **Dieser Befehl ist derzeit blockiert.\nFrage einen Admin für weitere Infomationen!**`));
}