const { MessageEmbed } = require('discord.js')
const colors = {
  red: 0xe74c3c,
  yellow: 0xf1c40f,
  green: 0x2ecc71,
  purple: 0x8e44ad,
  cyan: 0x0fcedb
}

const admin = require('firebase-admin')
const Discord = require('discord.js');
const { sendEmbed, createAPIMessage } = require('../embed.js');
var coins = 0
const price = 50

module.exports = {
  name: "play",
  description: "startet das Spiel!",
  options: [],
  run: async (client, interaction, args) => {

    const db = admin.firestore()
    const docRef = db.doc(`bot/${interaction.member.user.id}`)

    docRef.get()
      .then(async doc => {
        if (!doc.exists) {
          const emb = new MessageEmbed()
            .setColor(colors.red)
            .setDescription(`${interaction.member.nick}, du hast noch keinen Account!\nMit [/coins] kannst du dir einen anlegen.`)
          client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
              type: 4,
              data: await createAPIMessage(interaction, emb, client)
            }
          });
          return
        } else {

          coins = doc.data().coins

          if (coins < price) {
            const emb = new MessageEmbed()
              .setColor(colors.red)
              .setDescription(`${interaction.member.nick}, du hast nicht genug Geld! (Du brauchst 50)`)
            client.api.interactions(interaction.id, interaction.token).callback.post({
              data: {
                type: 4,
                data: await createAPIMessage(interaction, emb, client)
              }
            });
          } else {

            docRef.set({
              coins: coins - 50
            }).then(async () => {
              coins = coins - 50
              await roll(interaction)
            }).catch(err => {
              console.log(err)
            })

          }
        }
      }).catch(err => {
        debug.log(err)
      })

    async function roll() {
      var items = [":watermelon:", ":apple:", ":banana:"]

      var first = [Math.floor(Math.random() * 3)];
      var second = [Math.floor(Math.random() * 3)];
      var third = [Math.floor(Math.random() * 3)];
      client.channels.fetch(interaction.channel_id).then(async channel => {
        await client.api.interactions(interaction.id, interaction.token).callback.post({
          data: {
            type: 4,
            data: await createAPIMessage(interaction, `${items[first]} ${items[second]} ${items[third]}`, client)
          }
        });

        if (items[first] == items[second] && items[second] == items[third]) {
          coins = coins + 400

          docRef.set({
            coins: coins
          }).catch(err => {
            console.log(err)
          })

          const emb = new MessageEmbed()
            .setColor(colors.green)
            .setDescription(`Glückwunsch ${interaction.member.nick}!\nDu hast gewonnen! :partying_face:\nDu hast jetzt ${coins} Geld.`)

          sendEmbed(interaction, emb, client)

        } else {
          const emb = new MessageEmbed()
            .setColor(colors.red)
            .setDescription(`Schade ${interaction.member.nick}.\nViel Glück beim nächsten mal!\nDu hast noch ${coins} Geld`)

          sendEmbed(interaction, emb, client)

        }
      }
      )
    }
  }
}