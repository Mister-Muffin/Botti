const path = require('path');
const appDir = path.dirname(require.main.filename);

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
      const { bottiDB } = require(`${appDir}/main.js`);
      const user = args ? args.find(arg => arg.name.toLowerCase() == "name").value : interaction.member.user.id;

      const result = await bottiDB.collection(collectionName).findOne({ id: user })
      let schaufeln = result ? result.value : 0;


      let myobj = { $set: { value: schaufeln + 1, name: interaction.member.user.username } };

      await bottiDB.collection(collectionName).updateOne({ id: user }, myobj, { upsert: true })

      schaufeln++;

      if (args != null) {
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
