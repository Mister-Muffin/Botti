const { createAPIMessage } = require("../embed");
const fs = require('fs');
const path = require('path');

const appDir = path.dirname(require.main.filename);
const pathString = `${appDir}/data/access.json`;



module.exports = {
    name: "stats",
    description: "View Botti's server stats",
    options: [],
    run: async (client, interaction, args) => {
        let tokens = JSON.parse(fs.readFileSync(pathString, 'utf8'));
        console.log("HUUUUUIIIIIIIIIIIIIIi");

        const token = { 'date': (new Date).getTime(), 'token': makeid(8) };
        tokens.push(token);

        fs.writeFileSync(pathString, JSON.stringify(tokens));

        await client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: await createAPIMessage(interaction, `Du kannst die Statistiken unter https://discord.schweininchen.de/botti/?token=${token.token} aufrufen.`, client)
            }
        });


    }
}

function makeid(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}