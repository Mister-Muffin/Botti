const Discord = require('discord.js');
module.exports = {
    name: "fant",
    description: ":fant:",
    options: [],
    run: async (client, interaction, args) => {

        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: await createAPIMessage(interaction, "fant\n<:fant:806252665180520516>", client)
            }
        });
    }
}

async function createAPIMessage(interaction, content, client) {
    const apiMessage = await Discord.APIMessage.create(client.channels.resolve(interaction.channel_id), content)
        .resolveData()
        .resolveFiles();

    return { ...apiMessage.data, files: apiMessage.files };
}