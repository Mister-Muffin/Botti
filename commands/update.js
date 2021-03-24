const { createAPIMessage } = require("../embed");
const { execSync, spawn } = require("child_process");

module.exports = {
    name: "update",
    description: "Update this Bot",
    options: [
        {
            "name": "npm i",
            "description": "Run npm i",
            "type": 5,
            "required": false
        },],
    run: async (client, interaction, args) => {

        await client.channels.fetch(interaction.channel_id).then(async channel => {

            await client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: await createAPIMessage(interaction,
                        ":information_source: Updating Botti...", client)
                }
            });
            await channel.send(":arrows_counterclockwise: Fetching git repo...");

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

            if (args && args.find(arg => arg.name.toLowerCase() == "npm i").value) {

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
            }

            spawn(process.argv.shift(), process.argv, {
                cwd: process.cwd(),
                detached: true,
                stdio: "inherit"
            });

            const { setUpdated } = require(`../handler/updateFile.js`);
            setUpdated();

            await channel.send(`:white_check_mark: Botti was successfully updated!`);
            process.exit(0);
        });

    }
}