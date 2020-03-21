module.exports = {
    name: "ping",
    run: async (client, message, args) => {
      message.channel.send(`
      Derzeit verfügbare Commands:

      [--ping]
      :x: [--count]: zählt von 10 runter
      :x: [--register]: erstellt dir einen Account, für dein Geld (einmalig!).
      :x: [--delete]: löscht deinen Account!
      :x: [--daily]: gibt dir deine dir täglich zustehenden Münzen
      :x: [--play]: startet das Spiel
      :x: [--coins]: zeigt dir deinen aktuellen Kontostand an.
      [--debug] aktiviert debug Nachichten.
      :hourglass: [--clear + {zahl 1-100}]: Löscht eine bestimmte Anzahl an Nachichten`)

    }
}
