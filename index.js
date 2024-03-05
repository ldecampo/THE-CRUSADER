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
        if (message.author == 1095366459191984198) {
            break
        }
        if (message.content.toLowerCase().includes(word)) {
            message.reply('Successful test.');
            console.log("Message heard.");
        }
    }

    //Check for slurs words
    for (let word of unsafeWords.slurs) {
        if (message.author == 1095366459191984198) {
            break
        }
        if (message.content.toLowerCase().includes(word)) {
            message.reply('<a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> SLUR DETECTED <a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> \n <@&1095738454157041725> ENGAGE \n TIMING OUT MEMBER FOR 10 MINUTES');
                        //Attempt timeout
                        message.guild.members.fetch(message.author)
                        .then(member => {
                            // Use the guild member timeout method
                            member.timeout(600000,'Slur Detected')
                                .then(() => {
                                    console.log('Timed user out for 10 minutes.');
                                    client.channels.fetch(secrets.logID).then(channel => {
                                    channel.send(">>> " + "Timed out user <@" + message.author + "> for ten minutes due to slur at " + message.url + "\n Message content: \"" + message.content + "\"");
                                    })
                                })
                                .catch(console.error);
                        })
                        .catch(console.error);
        }
    }

    //Check for timeouttest words
    for (let word of unsafeWords.timeOutTest) {
        if (message.author == 1095366459191984198) {
            break
        }
        if (message.content.toLowerCase().includes(word)) {
            message.reply('Successful test, attempting timeout...')
            //Attempt timeout
            message.guild.members.fetch(message.author)
            .then(member => {
                // Use the guild member timeout method
                member.timeout(600000,'Slur Detected')
                    .then(() => {
                        console.log('Timed user out for 10 minutes.');
                        client.channels.fetch(secrets.logID).then(channel => {
                        channel.send(">>> " + "Timed out user <@" + message.author + "> for ten minutes due to test at " + message.url + "\n Message content: \"" + message.content + "\"");
                        })
                    })
                    .catch(console.error);
            })
            .catch(console.error);
    
        }

    }

    //Check for french words
    for (let word of unsafeWords.french) {
        if (message.author == 1095366459191984198) {
            break
        }
        if (message.content.toLowerCase().includes(word)) {
            let rand = Math.floor(Math.random() * 10);
            if (rand == 3) { 
            message.reply('<a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> SLUR DETECTED <a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> \n KNIGHTS ENGAGE');
          }
        }
    }

    // if (unsafeWords.slurs.some(word => message.content.toLowerCase().includes(" " + word + " "))) {
    //   message.reply('<a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> SLUR DETECTED <a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> \n <@&1095738454157041725> ENGAGE \n TIMING OUT MEMBER FOR 10 MINUTES');
    //       //message.member.timeout(10 * 60 * 1000, "Slur Detected.")
    // }
    // if (unsafeWords.timeOutTest.some(word => message.content.toLowerCase().includes(" " + word + " "))) {
    //       message.reply('Successful test, attempting timeout...')
    //       //message.member.timeout(10 * 60, "Timeout Test.")
    // }
    // if (unsafeWords.slurs.some(word => message.content.toLowerCase().includes(word))) {
    //   message.reply('<a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> POSSIBLE SLUR DETECTED <a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> \n <@&1095738454157041725> ENGAGE');
    // }
    // if (unsafeWords.test.some(word => message.content.toLowerCase().includes(" " + word + " "))) {
    //   message.reply('Successful test.');
    //   console.log("Message heard.")
    // }
    // if (unsafeWords.french.some(word => message.content.toLowerCase().includes(" " + word + " "))) {
    //       let rand = Math.floor(Math.random() * 10);
    //       if (rand == 3) { 
    //       message.reply('<a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> SLUR DETECTED <a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> \n KNIGHTS ENGAGE');
    //       }
    // }
});

  

// Log in to Discord with your client's token
client.login(token).catch(console.error);
