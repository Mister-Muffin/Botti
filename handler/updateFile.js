const fs = require('fs');
const path = require('path');
const pathString = `${path.resolve(__dirname, '..')}/data/updated.json`

let data;
try {
    data = require(pathString);
} catch (e) {
    console.warn(e);
    createFile();
    data = require(pathString);
}
// require(`./handler/command.js`)(client);

module.exports = {


    async sendUpdateMessage() {
        if (data.channelId) {
            await client.channels.fetch(data.channelId).then(async channel => {
                await channel.send("Restart completed.");
            });
            removeUpdated();
        }
    },
    setUpdated(channel_id) {
        fs.writeFileSync(pathString, JSON.stringify({ channelId: channel_id }))
    },

}

function createFile() {
    fs.writeFileSync(pathString, JSON.stringify({}));
}

function removeUpdated() {
    fs.writeFileSync(pathString, JSON.stringify({}))
}