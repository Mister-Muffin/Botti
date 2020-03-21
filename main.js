const Discord = require('discord.js')
const fs = require('fs')
const admin = require('firebase-admin')
const serviceAccount = require('./ServiceAccountKey.json')
const Embed = require('./embed.js')
const debug = require('./commands/debug.js')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
const db = admin.firestore()
const docRef = db.doc('bot/ehre')
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))
var client = new Discord.Client()

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

var currEhre = 0
var debugMode = false

require(`./handler/command.js`)(client);

client.on('ready', () => {
  console.log("ONLINE!")
  client.user.setActivity(`New Game: [--play]!`);
})

client.on('message', async msg => {
  if (msg.author.bot) return;
  if (!msg.guild) return;
  if (!msg.content.startsWith(config.prefix)) {
    if (msg.author.id != client.user.id && msg.content.includes('ehre') || msg.content.includes('ährä') || msg.content.includes('ärä')) {
      ehre(msg)
    }
  };

  // If msg.member is uncached, cache it.
  if (!msg.member) msg.member = await msg.guild.fetchMember(msg);

  const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);
  // If none is found, try to find it by alias
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  // If a command is finally found, run the command
  if (command) command.run(client, msg, args);

  if (debug.debugMode) msg.channel.send(`${msg.author.id}, ${client.user.id}`)

})

function ehre(msg) {
  docRef.get()
    .then(doc => {

      if (!doc.exists) {
        console.log('No such doc!')
        return
      }
      currEhre = doc.data().ehre
    })
    .then(function() {
      docRef.set({

        ehre: currEhre + 1

      }).then(function() {
        //console.log('done!')
        msg.channel.send(`${currEhre} Ehre generiert :ok_hand:`)
      }).catch(error => {
        console.log(error)
      })
    }).catch(error => {
      console.log(error)
    })
}

client.login(config.token)
