const { createAPIMessage } = require('../embed.js');

module.exports = {
    name: "count",
    description: "EHRE!",
    options: [{
        "name": "number",
        "description": "Wie viel soll der Bot zählen? (max.100)",
        "type": 4,
        "required": true
    },],
    run: async (client, interaction, args) => {
        const Embed = require('../embed.js')
        const number = args.find(arg => arg.name.toLowerCase() == "number").value
        if (number > 100) return

        await client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: await createAPIMessage(interaction, `Jaaaa, lasst uns bis ${number} zählen!`, client)
            }
        });

        for (let i = 1; i <= number; i++) {
            setTimeout(function () {
                client.channels.fetch(interaction.channel_id).then(async channel => {
                    channel.send(i)
                });
            }, 2000);

        }
    }
}
