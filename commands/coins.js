const { createAPIMessage } = require('../embed.js');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const collectionName = "coins";
module.exports = {
  name: "coins",
  description: "zeigt dir deinen aktuellen Kontostand an",
  options: [],
  run: async (client, interaction, args) => {

    const { bottiDB } = require(`${appDir}/main.js`);
    const authorId = interaction.member.user.id;

    const result = await bottiDB.collection(collectionName).findOne({ id: authorId })
    const coins = result ? result.value : 400;

    if (!result.value) {
      const myobj = { $set: { value: coins } };
      await bottiDB.collection(collectionName).updateOne({ id: authorId }, myobj, { upsert: true })
    }

    await client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: await createAPIMessage(interaction, `${interaction.member.nick}, du hast ${coins} Geld :moneybag:`, client)
      }
    });

  }
}