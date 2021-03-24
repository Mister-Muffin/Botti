const { MessageEmbed, APIMessage } = require('discord.js')

const colors = {
  red: 0xe74c3c,
  yellow: 0xf1c40f,
  green: 0x2ecc71,
  purple: 0x8e44ad,
  cyan: 0x0fcedb
}

module.exports = {
  async error(content, client, interaction, callbackType) {
    let message
    const emb = new MessageEmbed()
      .setColor(colors.red)
      .setDescription(content)

    module.exports.sendEmbed(interaction, emb, client, callbackType)

  },
  async warning(content, client, interaction, callbackType) {
    let message
    const emb = new MessageEmbed()
      .setColor(colors.yellow)
      .setDescription(content)

    module.exports.sendEmbed(interaction, emb, client, callbackType)
  },
  async success(content, client, interaction, callbackType) {
    const emb = new MessageEmbed()
      .setColor(colors.green)
      .setDescription(content)

    module.exports.sendEmbed(interaction, emb, client, callbackType)
  },
  async question(content, client, interaction, callbackType) {
    const emb = new MessageEmbed()
      .setColor(colors.purple)
      .setDescription(content)

    module.exports.sendEmbed(interaction, emb, client, callbackType)
  },
  async help(content, client, interaction, callbackType) {
    const emb = new MessageEmbed()
      .setColor(colors.cyan)
      .setDescription(content)

    module.exports.sendEmbed(interaction, emb, client, callbackType)
  },
  async createAPIMessage(interaction, content, client) {
    const apiMessage = await APIMessage.create(client.channels.resolve(interaction.channel_id), content)
      .resolveData()
      .resolveFiles();

    return { ...apiMessage.data, files: apiMessage.files };
  },
  async sendEmbed(interaction, embed, client, callbackType) {
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: callbackType ? callbackType : 4,
        data: await module.exports.createAPIMessage(interaction, embed, client)
      }
    });
  }
}

/* async function sendEmbed(interaction, embed, client, callbackType){
  client.api.interactions(interaction.id, interaction.token).callback.post({
    data: {
      type: callbackType ? callbackType : 4,
      data: await createAPIMessage(interaction, embed, client)
    }
  });
}

async function createAPIMessage(interaction, content, client) {


    module.exports.sendEmbed(interaction, emb, client, callbackType)
  },
  async createAPIMessage(interaction, content, client) {
    const apiMessage = await APIMessage.create(client.channels.resolve(interaction.channel_id), content)
      .resolveData()
      .resolveFiles();

    return { ...apiMessage.data, files: apiMessage.files };
    */
