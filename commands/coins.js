const { createAPIMessage } = require('../embed.js');
const path = require('path');
const appDir = path.dirname(require.main.filename);


module.exports = {
  name: "coins",
  description: "zeigt dir deinen aktuellen Kontostand an",
  options: [],
  run: async (client, interaction, args) => {

    const { dbclient } = require(`${appDir}/main.js`);
    const { getValueFromUserId } = require(`${appDir}/postgres.js`)

    const authorId = interaction.member.user.id;
    const coins = (await getValueFromUserId(dbclient, "Coins", authorId)).Coins;

    await client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: await createAPIMessage(interaction, `${interaction.member.nick}, du hast ${coins} Geld :moneybag:`, client)
      }
    });

  }
}