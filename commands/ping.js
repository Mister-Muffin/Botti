const debug = require('./debug.js')
const Embed = require('../embed.js')
module.exports = {
    name: "ping",
    description: "pong!",
    run: async (client, interaction, args) => {
        const msg = await channel.send(`🏓 Pinging....`);

        msg.edit(`🏓 Pong! (Latency is ${Math.floor(msg.createdAt - message.createdAt)}ms)`);
    }
}
