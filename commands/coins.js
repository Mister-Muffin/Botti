const Embed = require('../embed.js')
const admin = require('firebase-admin')
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
      .then(doc => {
        if (!doc.exists) {
          docRef.set({
            coins: 0
          })
          .then(doc => {
            Embed.success(`${interaction.member.nick}, dein Account wurde angelegt.\nMit [/coins] kannst du deinen Kontostand abfragen.`, client, interaction)
          }).catch(err => {
            console.log(err)
          })
          return
        } else {
          coins = doc.data().coins
          channel.send(`${interaction.member.nick}, du hast ${coins} Geld :moneybag:`)
          .catch(err => {console.log(err)})
        }
      })
  }
    )
}
}