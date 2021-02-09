const admin = require('firebase-admin')
const db = admin.firestore()
const docRef = db.doc('bot/schaufeln')
var schaufeln = 0
module.exports = {
  name: "schaufel",
  description: "Haue dir oder jemand anderen eine Schaufel an dem Kopf.",
  options: [
    {
      "name": "name",
      "description": "Ich bin die Beschreibung :).",
      "type": 6,
      "required": false
    },],
  run: async (client, interaction, args) => {

    docRef.get().then(doc => {
      if (!doc.exists) {
        console.log('No such doc!')
        return
      }
      schaufeln = doc.data().schaufeln
      if (args != null) {
        try {
          const user = args.find(arg => arg.name.toLowerCase() == "name").value
          client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
              type: 4,
              content: `* Schaufel an <@!${user}>'s Kopf! *\n${schaufeln + 1} Schaufeln wurden schon gegen Köpfe gehauen.`
            }
          });
        } catch (er) {
          client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
              type: callbackType ? callbackType : 4,
              content: `Nö (${er})`
            }
          });
        }
      } else {
        client.api.interactions(interaction.id, interaction.token).callback.post({
          data: {
            type: 4,
            content: `* Schaufel an den Kopf! *\n${schaufeln + 1} Schaufeln wurden schon gegen Köpfe gehauen.`
          }
        });
      }
    }).then(function () {
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
