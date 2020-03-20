const Discord = require('discord.js')
const fs = require('fs')
const { CmdParser } = require('discordjs-cmds')
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
const cmd = new CmdParser(client, config.prefix)

var currEhre = 0
var debugMode = false

function ping(msg, args) {
    msg.channel.send('Pong! :slight_smile:')
}

function debug(msg, args) {
  if (debugMode) {
    debugMode = false
    Embed.warning('Debug messages disabled')
  } else {
    debugMode = true;
    Embed.warning('Debug messages enabled')
  }
}

function clear(msg, args) {
  if (!args[0]) return msg.channel.send(":x:").delete(5000)
  msg.channel.bulkDelete(args[0]).then(() => {
    msg.channel.send(`${args[0]} Nachichten gelöscht`).then(msg => msg.delete(5000))
  })
}

function count(msg, args) {
    Embed.error(":x: This command is currently unaviable!", msg.channel)
    return;
    function counter(msg, i) {
        msg.channel.send(i)
    }
for (var i = 10; i >= 0; i - 1) {
    setTimeout(() => {counter(msg, i)}, 1000);
}
}

function help(msg, args) {
    msg.channel.send(`
    Derzeit verfügbare Commands:

    [--ping]
    :x: [--count]: zählt von 10 runter
    :x: [--register]: erstellt dir einen Account, für dein Geld (einmalig!).
    :x: [--delete]: löscht deinen Account!
    :x: [--daily]: gibt dir deine dir täglich zustehenden Münzen
    :x: [--play]: startet das Spiel
    :x: [--coins]: zeigt dir deinen aktuellen Kontostand an.
    [--debug] aktiviert debug Nachichten.
    :hourglass: [--clear + {zahl 1-100}]: Löscht eine bestimmte Anzahl an Nachichten`)
}

client.on('ready', () => {
    console.log("ONLINE!")
    client.user.setActivity('Help: [--?]')
})

client.on('message', (msg) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  // If message.member is uncached, cache it.
  if (!message.member) message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);
  // If none is found, try to find it by alias
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  // If a command is finally found, run the command
  if (command)
      command.run(client, message, args);

    if (author.id != client.user.id && content.includes('ehre') || content.includes('ährä') || content.includes('ärä')) {
        ehre(msg)
    }
})

function registerCmds() {
    cmd.register(ping, 'ping')
    cmd.register(help, '?')
    cmd.register(count, 'count')
    cmd.register(debug, 'debug')
    cmd.register(clear, 'clear')

    cmd.setHost('443872816933240833')
    cmd.setOptions({
        ownerpermlvl: 5
    })
}

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

registerCmds()

client.login(config.token)
