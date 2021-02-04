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
    client.channels.fetch(interaction.channel_id).then(async channel => {
    docRef.get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such doc!')
          return
        }
        schaufeln = doc.data().schaufeln
        if (args != null) {
          try {
            const user = args.find(arg => arg.name.toLowerCase() == "name").value
              channel.send(`* Schaufel an <@!${user}>'s Kopf! *\n${schaufeln + 1} Schaufeln wurden schon gegen Köpfe gehauen.`)
          } catch (er) {
            channel.send(`Nö (${er})`)
          }
        } else {
          channel.send(`* Schaufel an den Kopf! *\n${schaufeln + 1} Schaufeln wurden schon gegen Köpfe gehauen.`)
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

  })}
}
