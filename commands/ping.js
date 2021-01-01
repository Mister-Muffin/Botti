const debug = require('./debug.js')
const Embed = require('../embed.js')
module.exports = {
    name: "ping",
    run: async (client, message, args) => {
        const msg = await message.channel.send(`🏓 Pinging....`);

        msg.edit(`🏓 Pong! (Latency is ${Math.floor(msg.createdAt - message.createdAt)}ms)`);
    }
}
