// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');


const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

let secrets = require('./config.json');
const unsafeWords = require('./slurs.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}



// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

//Handle slash commands
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
	console.log(interaction);

    const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}

});


client.on('channelPinsUpdate', async function (channel, time) {
    let info = require("./guilds/" + channel.guild.id + ".json");

    // Fetch pinned messages
    let messages = await channel.messages.fetchPinned();
    let lastPinned = messages.first(); // Get the last pinned message

    let shouldLog = true; // Assuming you want to log new pinned messages by default
    if (info.pins.includes(lastPinned.url)) {
        shouldLog = false; // If message ID is already in pinLog, don't log it again
    }

    if (shouldLog) {
        info.pins.push(lastPinned.url);

        // Write updated pinLog back to pins.json
        require("fs").writeFileSync("./pins.json", JSON.stringify(info));
        

        let messageContent = "<@" + lastPinned.author.id + ">'s message pinned! " + lastPinned.url + "\n>>> " + lastPinned.content;

        client.channels.fetch(info.pinID).then(channel => {
            channel.send(messageContent).then(() => {
                console.log("Regular message sent successfully.");
    
                // Send URLs for each attachment in a separate message
                Array.from(lastPinned.attachments.values()).forEach(attachment => {
                    channel.send(attachment.url).then(() => {
                        console.log("Attachment URL sent successfully.");
                    }).catch(error => {
                        console.error("Error sending attachment URL:", error);
                    });
                });
            });
        });
    }
});



client.on("messageCreate", (message) => {

    let info = require("./guilds/" + message.guild.id + ".json");

    //Check if it contains a discord invite
    if (message.content.includes("discord.gg")) {
        if (message.author != 1095366459191984198) {
            message.reply('Invite link detected, deleting...');
            message.delete();
            client.channels.fetch(info.logID).then(channel => {
                channel.send(">>> " + "Deleted message from user <@" + message.author + "> due to discord invite." + "\n Message content: \"" + message.content + "\"");
                })
        }
    }

    

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
            message.reply('<a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> SLUR DETECTED <a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> \n <@&' + info.roleID + '> ENGAGE \n TIMING OUT MEMBER FOR 10 MINUTES');
                        //Attempt timeout
                        message.guild.members.fetch(message.author)
                        .then(member => {
                            // Use the guild member timeout method
                            member.timeout(info.timeoutTime,'Slur Detected')
                                .then(() => {
                                    console.log('Timed user out.');
                                    client.channels.fetch(info.logID).then(channel => {
                                    channel.send(">>> " + "Timed out user <@" + message.author + "> for " + info.timeoutTime + " milliseconds due to slur at " + message.url + "\n Message content: \"" + message.content + "\"");
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
                member.timeout(info.timeoutTime,'Slur Detected')
                    .then(() => {
                        console.log('Timed user out.');
                        client.channels.fetch(info.logID).then(channel => {
                        channel.send(">>> " + "Timed out user <@" + message.author + "> for " + info.timeoutTime + " milliseconds due to test at " + message.url + "\n Message content: \"" + message.content + "\"");
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
});

  

// Log in to Discord with your client's token
client.login(token).catch(console.error);
