const Embed = require('../embed.js')
const Discord = require('discord.js');
const {
  MessageEmbed
} = require('discord.js')
module.exports = {
  name: "clear",
  description: "Löscht eine bestimmte Anzahl an Nachichten.!",
  options: [
    {
      "name": "number",
      "description": "Wie viele Nachichten der Bot löschen soll.",
      "type": 4,
      "required": true
  },
  ],
  run: async (client, interaction, args) => {
    console.log(interaction.member.permissions);
    client.channels.fetch(interaction.channel_id).then(async channel => {
    if (!args[0]) return
    if (args[0] < 1 || args[0] > 99) {
      var embed = new MessageEmbed()
      .setColor(0xff3300)
      .setDescription(`:x: **Du musst eine Zahl zwischen 1 und 99 angeben!**`));
      
      client.api.interactions(interaction.id, interaction.token).callback.post({
      	data: {
        	type: 4,
          data: await createAPIMessage(interaction, embed)
        }
      });
      
      return;
    }
    var member = await (await client.guilds.fetch(interaction.guild_id)).members.fetch(interaction.member.user.id) // ?
    if (!member.hasPermission('MANAGE_MESSAGES')) {
      channel.send(`:x: Sorry ${interaction.member.nick}, du hast nicht die nötigen Rechte!\nBitte einen Admin um Hilfe!`)
      return
    }

    // blockCommand(channel);
    // return;
    
    channel.bulkDelete(args.find(arg => arg.name.toLowerCase() == "number").value, true).then(async msgs => {

	const emb = new MessageEmbed()
        	.setColor(0x2ecc71)
	    	.setDescription(`${msgs.size} Nachichten gelöscht`)
	    
      	client.api.interactions(interaction.id, interaction.token).callback.post({
      		data: {
        		type: 4,
          		data: await createAPIMessage(interaction, embed)
        	}
      	});
			
	setTimeout(() => {
          client.api.interactions(interaction.id, interaction.token).callback.messages.original.delete()
        	console.log(`********`)
        }, 2000)
  }).catch(err => console.log(err))
}

function blockCommand(channel) {
  var embed = new MessageEmbed()
      .setColor(0xff9300)
      .setDescription(`:warning: **Dieser Befehl ist derzeit blockiert.\nFrage einen Admin für weitere Infomationen!**`));
	
      client.api.interactions(interaction.id, interaction.token).callback.post({
      	data: {
        	type: 4,
          data: await createAPIMessage(interaction, embed)
        }
      });
}