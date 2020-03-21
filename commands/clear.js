module.exports = {
    name: "ping",
    run: async (client, msg, args) => {
      if (!args[0]) return msg.channel.send(":x:").delete(5000)
      msg.channel.bulkDelete(args[0]).then(() => {
        msg.channel.send(`${args[0]} Nachichten gelöscht`).then(msg => msg.delete(5000))
      })

    }
}
