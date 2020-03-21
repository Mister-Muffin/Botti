module.exports = {
  name: "help",
  run: async (client, message, args) => {
    message.channel.send(`
      Derzeit verfügbare Commands:

:white_check_mark: [--ping]
:white_check_mark: [--register]: erstellt dir einen Account, für dein Geld (einmalig!).
:x: [--daily]: gibt dir deine dir täglich zustehenden Münzen
:x: [--play]: startet das Spiel
:white_check_mark: [--coins]: zeigt dir deinen aktuellen Kontostand an.
:white_check_mark: [--debug] aktiviert debug Nachichten.
:white_check_mark: [--clear + {zahl 1-99}]: Löscht eine bestimmte Anzahl an Nachichten`)

  }
}
