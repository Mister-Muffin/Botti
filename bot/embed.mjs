import { EmbedBuilder, MessagePayload } from "discord.js";

const colors = {
    red: 0xe74c3c,
    yellow: 0xf1c40f,
    green: 0x2ecc71,
    purple: 0x8e44ad,
    cyan: 0x0fcedb
};

export async function error(content, client, interaction, callbackType) {
    const emb = new EmbedBuilder()
        .setColor(colors.red)
        .setDescription(content);

    module.exports.sendEmbed(interaction, emb, client, callbackType);

}
export async function warning(content, client, interaction, callbackType) {
    const emb = new EmbedBuilder()
        .setColor(colors.yellow)
        .setDescription(content);

    module.exports.sendEmbed(interaction, emb, client, callbackType);
}
export async function success(content, client, interaction, callbackType) {
    const emb = new EmbedBuilder()
        .setColor(colors.green)
        .setDescription(content);

    module.exports.sendEmbed(interaction, emb, client, callbackType);
}
export async function question(content, client, interaction, callbackType) {
    const emb = new EmbedBuilder()
        .setColor(colors.purple)
        .setDescription(content);

    module.exports.sendEmbed(interaction, emb, client, callbackType);
}
export async function help(content, client, interaction, callbackType) {
    const emb = new EmbedBuilder()
        .setColor(colors.cyan)
        .setDescription(content);

    module.exports.sendEmbed(interaction, emb, client, callbackType);
}
export async function createAPIMessage(interaction, content, client) {
    const apiMessage = await APIMessage.create(client.channels.resolve(interaction.channel_id), content)
        .resolveData()
        .resolveFiles();

    return { ...apiMessage.data, files: apiMessage.files };
}
export async function sendEmbed(interaction, embed, client, callbackType) {
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: callbackType ? callbackType : 4,
            data: await module.exports.createAPIMessage(interaction, embed, client)
        }
    });
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
