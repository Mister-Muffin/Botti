const fs = require('fs');
const { createAPIMessage } = require("../embed");
const path = require('path');

const downloadGit = require("download-git-repo")
//EHRE
module.exports = {
    name: "update",
    description: "Update this Bot",
    options: [],
    run: async (client, interaction, args) => {
        console.log(interaction.channel);

        deleteDir();

        downloadGit('direct:https://github.com/Mister-Muffin/Botti.git#master', `./lel`, { clone: true }, async (err) => {
            if (err) {
                console.log("ELLO:)")
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: await createAPIMessage(interaction, `Nein -> ${err}`, client)
                    }
                });
            } else {
                await client.channels.fetch(interaction.channel_id).then(async channel => {

                    await channel.send("⇊ Downloaded Git repo");

                    await client.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 4,
                            data: await createAPIMessage(interaction, `EHRE!`, client)
                        }
                    });

                    // require("child_process").spawn(process.argv.shift(), process.argv, {
                    //     cwd: process.cwd(),
                    //     detached: true,
                    //     stdio: "inherit"
                    // });

                    // process.exit(0);
                });
            }
        })

    }
}

function deleteDir() {
    const dir = ['./commands', './handler', './public', './lel'];

    const files = ['./embed.js', './main.js', './package.json', './server.js']

    // directory path

    // delete directory recursively

    for (const i of dir) {
        fs.rmdirSync(i, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }

            console.log(`${i} is deleted!`);
        });

    }
    for (const j of files) {
        fs.rmSync(j, (err) => {
            if (err) {
                throw err;
            }

            console.log(`${j} is deleted!`);
        });
    }
}