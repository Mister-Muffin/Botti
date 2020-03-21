const admin = require('firebase-admin')
module.exports = {
  name: "register",
  run: async (client, message, args) => {

    const db = admin.firestore()
    const docRef = db.doc(`bot/${message.member.user.tag}`)
    docRef.get()
      .then(doc => {
        if (doc.exists) {
          message.channel.send(`${message.author}, du bereits einen Account! Mit [--coins] kannst du deinen Kontostand abfragen.`)
        } else {
          docRef.set({
              coins: 0
            })
            .then(doc => {
              message.channel.send(`${message.author}, Account angelegt. Mit [--coins] kannst du deinen Kontostand abfragen.`)
            }).catch(err => {
              console.log(err)
            })
        }
      })
  }
}
