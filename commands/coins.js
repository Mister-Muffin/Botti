const Embed = require('../embed.js')
const admin = require('firebase-admin')
var coins = 0;
module.exports = {
  name: "coins",
  run: async (client, message, args) => {

    const db = admin.firestore()
    const docRef = db.doc(`bot/${message.member.user.tag}`)

    docRef.get()
      .then(doc => {
        if (!doc.exists) {
          Embed.error(`${message.author}, du hast noch keinen Account!\nMit [--register] kannst du dir einen anlegen.`, message.channel)
          return
        } else {
          coins = doc.data().coins
          message.channel.send(`${message.author} du hast ${coins} Geld :moneybag:`)
          .catch(err => {console.log(err)})
        }
      })
  }
}
