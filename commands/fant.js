const { createAPIMessage } = require("../embed");
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
        
    }
}