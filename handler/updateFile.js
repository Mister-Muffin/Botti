const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const pathString = `${appDir}/data/updated.json`

let data;
try {
    data = require(pathString);
} catch (e) {
    console.warn(e);
    createFile();
    data = require(pathString);
}

module.exports = {


    async sendUpdateMessage(client) {
        if (data.channelId) {
            await client.channels.fetch(data.channelId).then(async channel => {
                await channel.send(":white_check_mark: Restart completed.");
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