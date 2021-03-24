const { createAPIMessage } = require("../embed");
const path = require('path');

const downloadGit = require("download-git-repo")

module.exports = {
    name: "update",
    description: "Update this Bot",
    options: [],
    run: async (client, interaction, args) => {
        console.log(interaction.channel);

        downloadGit('direct:https://github.com/Mister-Muffin/Botti.git#master', `./`, { clone: true }, async function (err) {
            if (err) {
                await client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: await createAPIMessage(interaction, `Nein -> ${err}`, client)
                    }
                });
            } else {
                await client.channels.fetch(interaction.channel_id).then(async channel => {

                    await channel.send("Downloaded Git repo").then(m => { });



                    await client.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 4,
                            data: await createAPIMessage(interaction, `EHRE!`, client)
                        }
                    });

                    require("child_process").spawn(process.argv.shift(), process.argv, {
                        cwd: process.cwd(),
                        detached: true,
                        stdio: "inherit"
                    });

                    process.exit(0);
                });
            }
        })



        /* client.channels.fetch(interaction.channel_id).then(async channel => {
            const msg = await channel.send(`🏓 Pinging....`);
    
        msg.edit(`🏓 Pong! (Latency is ${Math.floor(msg.createdAt - msg.createdAt)}ms)`);
        }).catch(console.error); */
    }
}