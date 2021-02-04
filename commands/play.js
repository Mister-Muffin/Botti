const Embed = require('../embed.js')
const admin = require('firebase-admin')

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
          Embed.error(`${interaction.member.nick}, du hast noch keinen Account!\nMit [/coins] kannst du dir einen anlegen.`, client, interaction)
          return
        } else {

          coins = doc.data().coins

          if (coins < price) {
            Embed.error(`${interaction.member.nick}, du hast nicht genug Geld!. (Du brauchst 50)`, client, interaction)
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

    async function roll(interaction) {
      var items = [":watermelon:", ":apple:", ":banana:"]

      var first = [Math.floor(Math.random() * 3)];
      var second = [Math.floor(Math.random() * 3)];
      var third = [Math.floor(Math.random() * 3)];
      client.channels.fetch(interaction.channel_id).then(async channel => {
      channel.send(`${items[first]} ${items[second]} ${items[third]}`)

      if (items[first] == items[second] && items[second] == items[third]) {
        coins = coins + 200

        docRef.set({
          coins: coins
        }).catch(err => {
          console.log(err)
        })

        Embed.success(`Glückwunsch ${interaction.member.nick}!\nDu hast gewonnen! :partying_face:\nDu hast jetzt ${coins} Geld.`, client, interaction)
      } else {
        Embed.error(`Schade ${interaction.member.nick}.\nViel Glück beim nächsten mal!\nDu hast noch ${coins} Geld`, client, interaction)
      }
    }
      )}
  }
}
