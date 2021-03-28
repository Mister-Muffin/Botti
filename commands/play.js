const { MessageEmbed } = require('discord.js')
const path = require('path');
const appDir = path.dirname(require.main.filename);
const { createAPIMessage } = require('../embed.js');
const colors = {
  red: 0xe74c3c,
  yellow: 0xf1c40f,
  green: 0x2ecc71,
  purple: 0x8e44ad,
  cyan: 0x0fcedb
}

const price = 50
const collectionName = "coins";

module.exports = {
  name: "play",
  description: "startet das Spiel!",
  options: [],
  run: async (client, interaction, args) => {
    const { bottiDB } = require(`${appDir}/main.js`);
    const authorId = interaction.member.user.id;

    const result = await bottiDB.collection(collectionName).findOne({ id: authorId })
    let coins = result ? result.value : 1000;

    if (coins < price) {
      const emb = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(`${interaction.member.nick}, du hast nicht genug Geld! (Du brauchst 50)`)
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: await createAPIMessage(interaction, emb, client)
        }
      });
    } else {

      coins -= price;
      await bottiDB.collection(collectionName).updateOne({ id: authorId }, { $set: { value: coins } }, { upsert: true })

      //Roll!
      let items = [":watermelon:", ":apple:", ":banana:"]

      let first = [Math.floor(Math.random() * 3)];
      let second = [Math.floor(Math.random() * 3)];
      let third = [Math.floor(Math.random() * 3)];

      let emb;

      if (items[first] == items[second] && items[second] == items[third]) {
        coins += 400

        await db.collection(collectionName).updateOne({ id: authorId }, { $set: { value: coins } }, { upsert: true })

        emb = new MessageEmbed()
          .setColor(colors.green)
          .setDescription(`Glückwunsch ${interaction.member.nick}!\nDu hast gewonnen! :partying_face:\nDu hast jetzt ${coins} Geld.`)

      } else {
        emb = new MessageEmbed()
          .setColor(colors.red)
          .setDescription(`Schade ${interaction.member.nick}.\nViel Glück beim nächsten mal!\nDu hast noch ${coins} Geld`)

      }

      await client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: `${items[first]} ${items[second]} ${items[third]}`,
            embeds: [emb]
          }
        }
      });
    }
  }
}