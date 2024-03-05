// Require the necessary discord.js classes

const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

let secrets = require('./config.json');
const unsafeWords = require('./slurs.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });


// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("messageCreate", (message) => {

    //Check for test words
    for (let word of unsafeWords.test) {
        if (message.content.toLowerCase().includes(word)) {
            message.reply('Successful test.');
            console.log("Message heard.");
        }
    }

    //Check for slurs words
    for (let word of unsafeWords.slurs) {
        if (message.content.toLowerCase().includes(word)) {
            message.reply('<a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> SLUR DETECTED <a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> \n <@&1095738454157041725> ENGAGE \n TIMING OUT MEMBER FOR 10 MINUTES');
            // message.member.timeout(10 * 60 * 1000, "Slur Detected.")
        }
    }

    //Check for timeouttest words
    for (let word of unsafeWords.timeOutTest) {
        if (message.content.toLowerCase().includes(word)) {
            message.reply('Successful test, attempting timeout...')
            // message.member.timeout(10 * 60, "Timeout Test.")
        }

    }

    //Check for french words
    for (let word of unsafeWords.french) {
        if (message.content.toLowerCase().includes(word)) {
            let rand = Math.floor(Math.random() * 10);
            if (rand == 3) { 
            message.reply('<a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> SLUR DETECTED <a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> \n KNIGHTS ENGAGE');
          }
        }
    }
});

  

// Log in to Discord with your client's token
client.login(token).catch(console.error);
