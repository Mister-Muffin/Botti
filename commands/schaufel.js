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

    try {
      const { incrementValueFromUserId } = require(`${appDir}/postgres.js`)
      const { dbclient } = require(`${appDir}/main.js`);

      const user = args ? args.find(arg => arg.name.toLowerCase() == "name").value : interaction.member.user.id;

      (await incrementValueFromUserId(dbclient, "Schaufel", 1, user));
      const schaufeln = (await dbclient.query(`SELECT SUM("Schaufel") FROM users`)).rows[0].sum;

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
