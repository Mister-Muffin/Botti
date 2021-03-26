const { createAPIMessage } = require("../embed");
const { execSync, spawn } = require("child_process");

const path = require('path');
const appDir = path.dirname(require.main.filename);

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

        if (interaction.member.user.id != 443872816933240833) {
            await client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: await createAPIMessage(interaction,
                        ":x: Du darft den Befehl leider nicht ausführen!", client)
                }
            });
            return;
        }


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

            const { setUpdated } = require(`${appDir}/handler/updateFile.js`);
            setUpdated(channel.id);

            await channel.send(`:new: Botti was successfully updated and will be restarted!`);
            process.exit(0);
        });

    }
}