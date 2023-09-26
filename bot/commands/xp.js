import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { dirname } from "path";
const appDir = dirname(require.main.filename);

export const data = new SlashCommandBuilder()
    .setName("xp")
    .setDescription("xp")
    .addUserOption((option) =>
        option.setRequired(false)
            .setName("member")
            .setDescription("Wessen XP abgerufen werden")
    );
export async function execute(interaction) {
    try {
        const { dbclient: dbClient } = require(`${appDir}/main.cjs`);
        const { getValueFromUserId } = require(`${appDir}/postgres.cjs`);

        const member = interaction.options.getMember("member") || interaction.member;

        const authorId = member.user.id;
        const xp = (await getValueFromUserId(dbClient, "Xp", authorId)).Xp;
        const messages = (await getValueFromUserId(dbClient, "Messages", authorId)).Messages;

        // get a array of all xp by all mambers
        const rankTable = (await dbClient.query('SELECT "Xp" FROM users ORDER BY "Xp" DESC')).rows;
        // get the index from the sorted array by the xp and add one at the end to get the rank
        const rank = rankTable.findIndex((element) => {
            if (element.Xp === xp) {
                return true;
            }
        }) + 1;

        const third = 1 / 3;

        const level =
            ((-5 * Math.pow(10, third)) /
                (-Math.pow(-(Math.sqrt(9 * xp * xp + 1500 * xp + 50000) - 3 * xp - 250), third))) - 5;
        const medals = [
            "https://cdn.discordapp.com/attachments/704275816598732840/1031210582587736064/e2f8f101328a4b4ae7875945716345b3.webp",
            "https://cdn.discordapp.com/attachments/704275816598732840/1031210582222852117/c65da98dd1cd29756d4d5901ed549661.webp",
            "https://cdn.discordapp.com/attachments/704275816598732840/1031210581883105362/9ecf90770f4de9be7b44cb601d49722c.webp",
            "https://cdn.discordapp.com/attachments/704275816598732840/1031209390117752902/6ca609cb5fe0c1a5a74633567c2e743f.webp", // 🎖️ last place honorary medal
        ];

        const medalString = rank < 4 ? medals[rank - 1] : rank == rankTable.length ? medals[3] : null;

        const xpEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${member.nickname} (#${rank})`)
            .addFields({ name: "Nachichten", value: messages, inline: true })
            .addFields({ name: "Erfahrung", value: xp, inline: true })
            .addFields({ name: "Level", value: Math.floor(level).toString(), inline: true })
            .setImage(member.user.avatarURL())
            .setFooter({
                text: "⬤".repeat((level % 1) * 15) + "◯".repeat((1 - (level % 1)) * 15) +
                    ` ${Math.round(level % 1 * 100)}%`,
            });

        if (medalString) xpEmbed.setThumbnail(medalString);
        interaction.reply({ embeds: [xpEmbed] });
    } catch (e) {
        interaction.reply(":x: Das hat leider nicht funcktioniert :(");
        console.error(e);
    }
}
