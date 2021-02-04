const debug = require('./debug.js')
const Embed = require('../embed.js')
module.exports = {
    name: "ping",
    description: "pong!",
    options: [],
    run: async (client, interaction, args) => {
        console.log(interaction.channel);
        client.channels.fetch(interaction.channel_id).then(async channel => {
            const msg = await channel.send(`🏓 Pinging....`);

        msg.edit(`🏓 Pong! (Latency is ${Math.floor(msg.createdAt - msg.createdAt)}ms)`);
        }).catch(console.error);
    }
}