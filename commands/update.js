const { createAPIMessage } = require("../embed");
const { exec, spawn } = require("child_process");

module.exports = {
    name: "update",
    description: "Update this Bot",
    options: [],
    run: async (client, interaction, args) => {

        await client.channels.fetch(interaction.channel_id).then(async channel => {

            await client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: await createAPIMessage(interaction, ":arrows_counterclockwise: ⇊ Updating Botti...", client)
                }
            });

            exec("git reset --hard Githubn/master && git fetch --all --prune && npm i", (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });

            spawn(process.argv.shift(), process.argv, {
                cwd: process.cwd(),
                detached: true,
                stdio: "inherit"
            });
            await channel.send(`:ok: Botti was successfully updated!`);
            process.exit(0);
        });

    }
}