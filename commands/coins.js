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
          message.channel.send(`${message.author}, du hast noch keinen Account! Mit [--register] kannst du dir einen anlegen.`)
          return
        }
        coins = doc.data().coins
      }).then(() => {
        message.channel.send(`${message.author} du hast ${coins} Geld :moneybag:`)
        .catch(err => {console.log(err)})
      })

  }
}
