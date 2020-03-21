const Discord = require('discord.js')
const fs = require('fs')
const admin = require('firebase-admin')
const serviceAccount = require('./ServiceAccountKey.json')
const Embed = require('./embed.js')

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

["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

client.on('ready', () => {
    console.log("ONLINE!")
    client.user.setActivity('Help: [--?]')
})

client.on('message', async msg => {
  if (msg.author.bot) return;
  if (!msg.guild) return;
  if (!msg.content.startsWith(config.prefix)) return;

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

    if (msg.author.id != client.user.id && msg.content.includes('ehre') || msg.content.includes('ährä') || msg.content.includes('ärä')) {
        ehre(msg)
    }
})

function ehre(msg) {
docRef.get()
.then(doc => {

    if (!doc.exists) { console.log('No such doc!') }
    currEhre = doc.data().ehre

    //console.log('cff')
}).then(function() {
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
