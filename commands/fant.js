const Discord = require('discord.js');
module.exports = {
    name: "fant",
    description: ":fant:",
    options: [],
    run: async (client, interaction, args) => {


        await client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: await createAPIMessage(interaction, "fant", client)
            }
        });

        client.channels.fetch(interaction.channel_id).then(async channel => {
            await channel.send("<:fant:806252665180520516>");
        }).catch(console.error);

        // client.webhooks("493003865537511436", ineraction.token).post({

        //     content:"<:fant:806252665180520516>"

        // })
    }
}

async function createAPIMessage(interaction, content, client) {
    const apiMessage = await Discord.APIMessage.create(client.channels.resolve(interaction.channel_id), content)
        .resolveData()
        .resolveFiles();

    return { ...apiMessage.data, files: apiMessage.files };
}