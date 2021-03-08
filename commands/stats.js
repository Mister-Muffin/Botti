const { createAPIMessage } = require("../embed");
const fs = require('fs');
const path = require('path');

const pathString = `${path.resolve(__dirname, '..')}/data/access.json`;



module.exports = {
    name: "stats",
    description: "TODO",
    options: [],
    run: async (client, interaction, args) => {
        var tokens = JSON.parse(fs.readFileSync(pathString, 'utf8'));
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
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}