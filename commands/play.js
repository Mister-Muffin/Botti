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

module.exports = {
  name: "play",
  description: "startet das Spiel!",
  options: [],
  run: async (client, interaction, args) => {
    const { getValueFromUserId, incrementValueFromUserId } = require(`${appDir}/postgres.js`)
    const { dbclient } = require(`${appDir}/main.js`);
    const authorId = interaction.member.user.id;

    let coins = (await getValueFromUserId(dbclient, "Coins", authorId)).Coins;

    if (coins < price) {
      const emb = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(`${interaction.member.nick}, du hast leider nicht genug Geld! (Du brauchst mindestens 50)`)
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: await createAPIMessage(interaction, emb, client)
        }
      });
    } else {
      coins -= price;
      (await incrementValueFromUserId(dbclient, "Coins", -price, authorId));

      //Roll!
      let items = [":watermelon:", ":apple:", ":banana:"]

      let first = [Math.floor(Math.random() * 3)];
      let second = [Math.floor(Math.random() * 3)];
      let third = [Math.floor(Math.random() * 3)];

      let emb;

      if (items[first] == items[second] && items[second] == items[third]) {

        coins += 400;
        (await incrementValueFromUserId(dbclient, "Coins", 400, authorId));

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