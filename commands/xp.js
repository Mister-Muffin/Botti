const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder} = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");
const canvas = createCanvas(200, 200);
const ctx = canvas.getContext("2d");
const appDir = path.dirname(require.main.filename);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("xp")
        .setDescription("xp"),
    async execute(interaction) {

        const { dbclient: dbClient } = require(`${appDir}/main.js`);
        const { getValueFromUserId } = require(`${appDir}/postgres.js`);

        const authorId = interaction.member.user.id;
        const xp = (await getValueFromUserId(dbClient, "Xp", authorId)).Xp;

        const rankTable = (await dbClient.query("SELECT \"Xp\" FROM users ORDER BY \"Xp\" DESC")).rows;
        const rank = rankTable.findIndex( element => {
            if (element.Xp === xp) {
                return true;
            }
        }) + 1;

        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${interaction.member.nickname} (#${rank})`)
            .setURL("https://discord.js.org/")
            .setThumbnail(interaction.user.avatarURL())
            .addFields({ name: "Nachichten", value: "3.6k", inline: true })
            .addFields({ name: "Erfahrung", value: xp, inline: true })
            .addFields({ name: "Level", value: "1", inline: true })
            .setTimestamp()
            .setFooter({ text: "---------", iconURL: "https://i.imgur.com/AfFp7pu.png" });

        interaction.reply({ embeds: [exampleEmbed] });

        // eslint-disable-next-line no-unused-vars
        async function createImage() {
            // Write "Awesome!"
            ctx.font = "30px Impact";
            ctx.rotate(0.1);
            ctx.fillText("Awesome!", 50, 100);

            // Draw line under text
            const text = ctx.measureText("Awesome!");
            ctx.strokeStyle = "rgba(0,0,0,0.5)";
            ctx.beginPath();
            ctx.lineTo(50, 102);
            ctx.lineTo(50 + text.width, 102);
            ctx.stroke();

            // Draw cat with lime helmet
            loadImage(interaction.user.avatarURL()).then((image) => {
                ctx.drawImage(image, 50, 0, 70, 70);

                console.log("<img src=\"" + canvas.toDataURL() + "\" />");
            });

            const attachment = new AttachmentBuilder(await canvas.createPNGStream(), { name: "image.png" });

            interaction.reply({ files: [attachment] });
        }

    }
};