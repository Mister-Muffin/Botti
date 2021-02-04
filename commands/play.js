const Embed = require('../embed.js')
const admin = require('firebase-admin')

var coins = 0
const price = 50

module.exports = {
  name: "play",
  description: "startet das Spiel!",
  options: [],
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

          if (coins < price) {
            Embed.error(`${message.author}, du hast nicht genug Geld!. (Du brauchst 50)`, message.channel)
          } else {

            docRef.set({
              coins: coins - 50
            }).then(() => {
              coins = coins - 50
              roll()
            }).catch(err => {
              console.log(err)
            })

          }
        }
      }).catch(err => {
        debug.log(err)
      })

    function roll() {
      var items = [":watermelon:", ":apple:", ":banana:"]

      var first = [Math.floor(Math.random() * 3)];
      var second = [Math.floor(Math.random() * 3)];
      var third = [Math.floor(Math.random() * 3)];

      message.channel.send(`${items[first]} ${items[second]} ${items[third]}`)

      if (items[first] == items[second] && items[second] == items[third]) {
        coins = coins + 200

        docRef.set({
          coins: coins
        }).catch(err => {
          console.log(err)
        })

        Embed.success(`Glückwunsch ${message.author}!\nDu hast gewonnen! :partying_face:\nDu hast jetzt ${coins} Geld.`, message.channel)
      } else {
        Embed.error(`Schade ${message.author}.\nViel Glück beim nächsten mal!\nDu hast noch ${coins} Geld`, message.channel)
      }
    }



  }
}
