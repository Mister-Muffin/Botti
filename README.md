# Botti
I am a happy Discord Bot :smiley:

## Installation
### Via Docker (recommended) (not available yet):
Just for one time use (no persistency or stats webserver):
```
docker run --env-file [/path/to/env/file] bigbraindamage/botti:latest
```

#### Botti environment variables (see examples in "[examples](#env-file)"):
You need to give Botti some variables to work with:
- SERVICE_ACCOUNT_KEY=[FIREBASE_CONFIG_KEYS]
- CONFIG=[DISCORD_CONFIG]

### Via git clone:
You can run Botti by cloning this GitHub repo and change to the new directory:
```
git clone https://github.com/Mister-Muffin/Botti.git && cd Botti
```
Install dependencies with npm (concurrently is needed to run express and discord.js at the same time):
```
npm i
npm i -g concurrently
```
#### Botti environment variables (see examples in "[examples](#env-file)"):
You need to create a ".env" file in Botti's root directory in order to give Botti some variables to work with:
- SERVICE_ACCOUNT_KEY=[FIREBASE_CONFIG_KEYS]
- CONFIG=[DISCORD_CONFIG]

Finally, you can run Botti and Express concurrently with:
```
npm run full
```
Or run Botti and Express independently with ```npm run start```and ```npm run express```

## Examples:
### .env file:
([Firebase documentaion on how to get the "GOOGLE_APPLICATION_CREDENTIALS"](https://firebase.google.com/docs/admin/setup#initialize-sdk) )  
SERVICE_ACCOUNT_KEY={"type": "service_account","project_id": "[ID]","private_key_id": "[EXAMPLE]","private_key": "[EXAMPLE]","client_email": "[EXAMPLE]","client_id": "[EXAMPLE]","auth_uri": "[EXAMPLE]","token_uri": "[EXAMPLE]","auth_provider_x509_cert_url": "[EXAMPLE]","client_x509_cert_url":"[EXAMPLE]"}
CONFIG={"token": "[DISCORD_BOT_TOKEN","owner": "[ID_OF_SERVER_OWNER","prefix": "[PREFIX_TO_REACH_BOT]"}  
CONFIG={"token": "iamadiscordbottoken","owner": "12345678987654321","prefix": "--"}

### Docker run commands:
#### Command to store data from Botti and open port 80 for the Express Server/API:
Create a Docker volume (named "botti") to store data:
```
docker volume create botti
```
Run the container with the newly created volume and port 80 opened:
```
docker run --env-file [/path/to/env/file] -v botti:/botti/data/ -p 80:5000 bigbraindamage/botti:latest
```

## Commands: /

Standard:

- ping: Check if the Bot is up and running, additionally get the Latency
- clear + {number: 1-99}: Delete >number< of messages in the current channel
- stats: Get a link to access stats

Game:
- coins: Return your current account balance in chat
- daily: Request your daily coins (resets at 00:00)
- play: Let the game begin!

Fun:
- count + {number: 1-100}: Count to >number<
- schaufel + {person (optional): @mention} hit you or >person< on the head with a shovel
- fant: Get a Fant!

Failing:
- update: Update Botti

## Stats generation in chat

- Ehre
- Alla
- Yeet
