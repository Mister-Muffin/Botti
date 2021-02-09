module.exports = {
  name: "ping",
  description: "pong!",
  options: [],
  run: async (client, interaction, args) => {
    console.log(interaction.channel);

    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: "🏓 Pong!"
        }
      }
    });

    /* client.channels.fetch(interaction.channel_id).then(async channel => {
        const msg = await channel.send(`🏓 Pinging....`);

    msg.edit(`🏓 Pong! (Latency is ${Math.floor(msg.createdAt - msg.createdAt)}ms)`);
    }).catch(console.error); */
  }
}