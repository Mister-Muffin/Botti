const admin = require('firebase-admin')
const db = admin.firestore()
const docRef = db.doc('bot/schaufeln')
var schaufeln = 0
module.exports = {
  name: "schaufel",
  description: "haut dir eine Schaufel gegen den Kopf.",
  run: async (client, message, args) => {

    docRef.get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such doc!')
          return
        }
        schaufeln = doc.data().schaufeln
        if (args[0] != null) {
          try {
            client.user.fetch(args[0]).then(_ => {
              message.channel.send(`* Schaufel an ${args[0]}'s Kopf! *\n${schaufeln + 1} Schaufeln wurden schon gegen Köpfe gehauen.`)
            })
          } catch (er) {
            message.channel.send(`Nö (${er})`)
          }
        } else {
          message.channel.send(`* Schaufel an den Kopf! *\n${schaufeln + 1} Schaufeln wurden schon gegen Köpfe gehauen.`)
        }
      })
      .then(function () {
        docRef.set({

          schaufeln: schaufeln + 1

        }).catch(error => {
          console.log(error)
        })
      }).catch(error => {
        console.log(error)
      })

  }
}
