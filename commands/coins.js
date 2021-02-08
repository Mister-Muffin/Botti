const Embed = require('../embed.js')
const admin = require('firebase-admin')
const Discord = require('discord.js');
var coins = 0;
module.exports = {
  name: "coins",
  description: "zeigt dir deinen aktuellen Kontostand an",
  options: [],
  run: async (client, interaction, args) => {
    client.channels.fetch(interaction.channel_id).then(async channel => {
      const db = admin.firestore()
      const docRef = db.doc(`bot/${interaction.member.user.id}`)
      docRef.get()
        .then(async doc => {
          if (!doc.exists) {
            docRef.set({
              coins: 1000
            })
              .then(async doc => {
                Embed.success(`${interaction.member.nick}, dein Account wurde angelegt.\nMit [/coins] kannst du deinen Kontostand abfragen.`, client, interaction)
              }).catch(err => {
                console.log(err)
              })
            return
          } else {
            coins = doc.data().coins
            await client.api.interactions(interaction.id, interaction.token).callback.post({
              data: {
                type: 4,
                data: await createAPIMessage(interaction, `${interaction.member.nick}, du hast ${coins} Geld :moneybag:`, client)
              }
            });
          }
        })
    }
    )
  }
}


async function createAPIMessage(interaction, content, client) {
  const apiMessage = await Discord.APIMessage.create(client.channels.resolve(interaction.channel_id), content)
    .resolveData()
    .resolveFiles();

  return { ...apiMessage.data, files: apiMessage.files };
}