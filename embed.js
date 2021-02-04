const {
  MessageEmbed
} = require('discord.js')

const colors = {
  red: 0xe74c3c,
  yellow: 0xf1c40f,
  green: 0x2ecc71,
  purple: 0x8e44ad,
  cyan: 0x0fcedb
}

module.exports = {
  error(content, client, interaction) {
    var message
    const emb = new MessageEmbed()
      .setColor(colors.red)
      .setDescription(content)
      client.channels.fetch(interaction.channel_id).then(async channel => {channel.send('', emb)});
    
  },
  warning(content, client, interaction) {
    var message
    const emb = new MessageEmbed()
      .setColor(colors.yellow)
      .setDescription(content)

      client.channels.fetch(interaction.channel_id).then(async channel => {channel.send('', emb)});
  },
  success(content, client, interaction) {
    const emb = new MessageEmbed()
      .setColor(colors.green)
      .setDescription(content)

      client.channels.fetch(interaction.channel_id).then(async channel => {channel.send('', emb)});
  },
  question(content, client, interaction) {
    const emb = new MessageEmbed()
      .setColor(colors.purple)
      .setDescription(content)

      client.channels.fetch(interaction.channel_id).then(async channel => {channel.send('', emb)});
  },
  help(content, client, interaction) {
    const emb = new MessageEmbed()
      .setColor(colors.cyan)
      .setDescription(content)

      client.channels.fetch(interaction.channel_id).then(async channel => {channel.send('', emb)});
  }
}
