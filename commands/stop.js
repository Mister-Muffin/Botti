const { createAPIMessage } = require("../embed");
const embed = require("../embed");

module.exports = {
    name: "stop",
    description: "Stop this Bot (Limited usage)",
    options: [],
    run: async (client, interaction, args) => {

        if (interaction.member.user.id != 443872816933240833) {
            await client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: await createAPIMessage(interaction,
                        embed.error(":x: Du darft den Befehl leider nicht ausführen!", client, interaction), client)
                }
            });
        } else {

            await client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: await createAPIMessage(interaction,
                        ":octagonal_sign: Stopping Botti...", client)
                }
            });
            process.exit(0);
        }

    }
}