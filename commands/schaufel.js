const path = require('path');
const appDir = path.dirname(require.main.filename);

let schaufeln = 0
module.exports = {
  name: "schaufel",
  description: "Haue dir oder jemand anderen eine Schaufel an dem Kopf.",
  options: [
    {
      "name": "name",
      "description": "Ich bin die Beschreibung :).",
      "type": 6,
      "required": false
    },],
  run: async (client, interaction, args) => {
    const collectionName = "schaufeln";

    try {
      const authorId = interaction.member.user.id;
      const { bottiDB } = require(`${appDir}/main.js`);

      const result = await bottiDB.collection(collectionName).findOne({ id: authorId })
      let schaufeln = result ? result.value : 0;

      let myobj = { $set: { value: schaufeln + 1, name: interaction.member.user.username } };

      await bottiDB.collection(collectionName).updateOne({ id: authorId }, myobj, { upsert: true })

      schaufeln++;

      if (args != null) {
        const user = args.find(arg => arg.name.toLowerCase() == "name").value
        client.api.interactions(interaction.id, interaction.token).callback.post({
          data: {
            type: 4,
            data: {
              content: `* Schaufel an <@!${user}>'s Kopf! *\n${schaufeln} Schaufeln wurden schon gegen Köpfe gehauen.`
            }
          }
        });



      } else {
        client.api.interactions(interaction.id, interaction.token).callback.post({
          data: {
            type: 4,
            data: {
              content: `* Schaufel an den Kopf! *\n${schaufeln} Schaufeln wurden schon gegen Köpfe gehauen.`
            }
          }
        });
      }



    } catch (e) { console.warn(e) };
  }
}
