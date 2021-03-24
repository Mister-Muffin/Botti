const { createAPIMessage } = require("../embed");
const { execSync, spawn } = require("child_process");

module.exports = {
    name: "update",
    description: "Update this Bot",
    options: [],
    run: async (client, interaction, args) => {

        await client.channels.fetch(interaction.channel_id).then(async channel => {

            await client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: await createAPIMessage(interaction, ":arrows_counterclockwise: ⇊ Updating Botti...\nFetching git repo...", client)
                }
            });

            execSync("git fetch --all && git reset --hard Githubn/master", (error, stdout, stderr) => {
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

            await channel.send(`:information_source: Updating dependencies, this may take a while!`);

            execSync("npm i", (error, stdout, stderr) => {
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
            await channel.send(`:ballot_box_with_check: Botti was successfully updated!`);
            process.exit(0);
        });

    }
}