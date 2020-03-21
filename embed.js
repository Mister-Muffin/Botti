const {
  MessageEmbed
} = require('discord.js')

const colors = {
  red: 0xe74c3c,
  yellow: 0xf1c40f,
  green: 0x2ecc71,
  purple: 0x8e44ad
}

module.exports = {
  error(content, channel) {
    var message
    const emb = new MessageEmbed()
      .setColor(colors.red)
      .setDescription(content)

    channel.send('', emb)
  },
  warning(content, channel) {
    var message
    const emb = new MessageEmbed()
      .setColor(colors.yellow)
      .setDescription(content)

    channel.send('', emb)
  },
  success(content, channel) {
    const emb = new MessageEmbed()
      .setColor(colors.green)
      .setDescription(content)

    channel.send('', emb).catch(err => {
      console.log(err)
    })
  },
  question(content, channel) {
    const emb = new MessageEmbed()
      .setColor(colors.purple)
      .setDescription(content)

    channel.send('', emb).catch(err => {
      console.log(err)
    })
  }
}
