const { MessageEmbed, APIMessage } = require('discord.js')

const colors = {
  red: 0xe74c3c,
  yellow: 0xf1c40f,
  green: 0x2ecc71,
  purple: 0x8e44ad,
  cyan: 0x0fcedb
}

module.exports = {
  error(content, client, interaction, callbackType) {
    var message
    const emb = new MessageEmbed()
      .setColor(colors.red)
      .setDescription(content)

    module.exports.sendEmbed(interaction, emb, client, callbackType)

  },
  warning(content, client, interaction, callbackType) {
    var message
    const emb = new MessageEmbed()
      .setColor(colors.yellow)
      .setDescription(content)

    module.exports.sendEmbed(interaction, emb, client, callbackType)
  },
  success(content, client, interaction, callbackType) {
    const emb = new MessageEmbed()
      .setColor(colors.green)
      .setDescription(content)

    module.exports.sendEmbed(interaction, emb, client, callbackType)
  },
  question(content, client, interaction, callbackType) {
    const emb = new MessageEmbed()
      .setColor(colors.purple)
      .setDescription(content)

    module.exports.sendEmbed(interaction, emb, client, callbackType)
  },
  help(content, client, interaction, callbackType) {
    const emb = new MessageEmbed()
      .setColor(colors.cyan)
      .setDescription(content)

    module.exports.sendEmbed(interaction, emb, client, callbackType)
  },
  createAPIMessage(interaction, content, client) {
    const apiMessage = await APIMessage.create(client.channels.resolve(interaction.channel_id), content)
      .resolveData()
      .resolveFiles();

    return { ...apiMessage.data, files: apiMessage.files };
  },
  sendEmbed(interaction, embed, client, callbackType) {
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: callbackType ? callbackType : 4,
        data: await module.exports.createAPIMessage(interaction, embed, client)
      }
    });
  }
}
