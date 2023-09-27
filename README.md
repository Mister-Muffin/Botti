# Botti

I am a happy Discord Bot :smiley:

## Installation

### Via Docker (recommended) (public image not available yet)

Just for one time use (no persistency or stats webserver):

```bash
docker run --env-file [/path/to/env/file] bigbraindamage/botti:latest
```

### Via git clone

You can run Botti by cloning this GitHub repo and change to the new directory:

```bash
git clone https://github.com/Mister-Muffin/Botti.git && cd Botti
```

**Note: Make sure to set the environment variables!**

Run Botti and the webserver concurrently with:

```bash
deno task full
```

Or run Botti and the backend independently with ```deno task bot```and ```deno task backend```

### Botti environment variables

You need to give Botti some variables to work with:

CONFIG={"token": "iamadiscordbottoken","owner": "12345678987654321"}  
DB_USER=botti  
DB_PASS=securepassword  
DB_IP=192.168.178.2  
DB_DB=botti

## .env file

All available variables:

- CONFIG Discord config
- DB_USER PostgreSQL username
- DB_PASS PostgreSQL password
- DB_IP IP-Adress of the PostgreSQL server
- DB_PORT PostgreSQL server port
- DB_DB Database name

## Examples

### Docker run commands

#### Command to store data from Botti and open port 80 for the Express Server/API

Create a Docker volume (named "botti") to store data:

```bash
docker volume create botti
```

Run the container with the newly created volume and port 80 opened:

```bash
docker run --env-file [/path/to/env/file] -v botti:/botti/bot/data/ -v botti:/botti/website/data/ -p 80:5000 bigbraindamage/botti:latest
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
