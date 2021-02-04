const admin = require('firebase-admin')
const Embed = require('../embed.js')
module.exports = {
  name: "register",
  description: "erstellt dir einen Account, für dein Geld (einmalig!).",
  run: async (client, message, args) => {

    const db = admin.firestore()
    const docRef = db.doc(`bot/${message.member.user.tag}`)
    docRef.get()
      .then(doc => {
        if (doc.exists) {
          Embed.warning(`${message.author}, du bereits einen Account!\nMit [--coins] kannst du deinen Kontostand abfragen.`, message.channel)
        } else {
          docRef.set({
              coins: 0
            })
            .then(doc => {
              Embed.success(`${message.author}, dein Account wurde angelegt.\nMit [--coins] kannst du deinen Kontostand abfragen.`, message.channel)
            }).catch(err => {
              console.log(err)
            })
        }
      })
  }
}
