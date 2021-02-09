const { createAPIMessage } = require("../embed");

var ping = NaN;

module.exports = {
  name: "ping",
  description: "pong!",
  options: [],
  run: async (client, interaction, args) => {
    console.log(interaction.channel);

    await client.channels.fetch(interaction.channel_id).then(async channel => {

      await channel.send("Pinging...").then(m => {

        ping = Date.now() - m.createdTimestamp;

        m.delete();

      });

      await client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: await createAPIMessage(interaction, `🏓 Pong! (Latency is ${ping}ms. API Latency is ${Math.round(client.ws.ping)}ms)`, client)
        }
      });

    });

    /* client.channels.fetch(interaction.channel_id).then(async channel => {
        const msg = await channel.send(`🏓 Pinging....`);

    msg.edit(`🏓 Pong! (Latency is ${Math.floor(msg.createdAt - msg.createdAt)}ms)`);
    }).catch(console.error); */
  }
}