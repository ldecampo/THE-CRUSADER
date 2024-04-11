// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');


const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

let secrets = require('./config.json');
const unsafeWords = require('./slurs.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions] });

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
    try {
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
    } catch (error) {
        console.log(error)
        const fs = require('fs');
        const time = new Date().toISOString().replace(/:/g, '-'); // Generating a timestamp in a format suitable for file name
        const filePath = `Crash/${time}.txt`;
        const errorString = JSON.stringify(error, null, 2); // Stringify the error object with pretty formatting
    
        fs.writeFile(filePath, errorString, (err) => {
            if (err) {
                console.error('Error writing to crash file:', err);
            } else {
                console.log('Error logged to:', filePath);
            }
        });
    }
});



client.on("messageCreate", async (message) => {
    
    try {
        let info = require("./guilds/" + message.guild.id + ".json");
        //Check if it contains a discord invite
        if (message.content.includes("discord.gg")) {
            console.log("<" + message.content + ">")
            if (message.author != 1095366459191984198) {
                const log1 = message.content.replace(/@everyone/g, '@.everyone')
                const log = log1.replace(/testString2345/g, '@.everyone')
                const author = message.author
                const id = message.id

                try {
                    // Delete the message
                    

                    // Send reply with message reference
                    
                    await message.reply('Invite link detected, deleting...', { message_reference: { message_id: id, fail_if_not_exists: false } });

                    // Log the deleted message
                    } catch (error) {
                    // const channel = await client.channels.fetch(info.logID);
                    // await channel.send("Error deleting message when processing invite link, attempting to log anyway...")
                    // console.error("Error while processing invite link:", error);
                    // await channel.send(">>> " + "Deleted message from user <@" + author + "> due to discord invite." + "\n Message content: \"" + log + "\"");

                }
                message.delete();
                const channel = await client.channels.fetch(info.logID);
                channel.send(">>> " + "Deleted message from user <@" + author + "> due to discord invite." + "\n Message content: \"" + log + "\"");
                

                // message.reply('Invite link detected, deleting...', { message_reference: { message_id: message.id, fail_if_not_exists: false } });
                // client.channels.fetch(info.logID).then(channel => {
                //     channel.send(">>> " + "Deleted message from user <@" + message.author + "> due to discord invite." + "\n Message content: \"" + log + "\"");
                //     })
                // message.delete();
            }
        }

        //Check for test words
        for (let word of unsafeWords.test) {
            if (message.author == 1095366459191984198) {
                break
            }
            if (message.content.toLowerCase().includes(word)) {
                message.reply('Successful test.', { message_reference: { message_id: message.id, fail_if_not_exists: false } });
                console.log("Message heard.");
            }
        }

        //Check for slurs words
        for (let word of unsafeWords.slurs) {
            if (message.author == 1095366459191984198) {
                break
            }
            if (message.content.toLowerCase().includes(word)) {
                message.reply('<a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> SLUR DETECTED <a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> \n <@&' + info.roleID + '> ENGAGE \n TIMING OUT MEMBER FOR 10 MINUTES', { message_reference: { message_id: message.id, fail_if_not_exists: false } });
                            //Attempt timeout
                            message.guild.members.fetch(message.author)
                            .then(member => {
                                // Use the guild member timeout method
                                member.timeout(info.timeoutTime,'Slur Detected')
                                    .then(() => {
                                        const replace = '@everyone'

                                        const log = message.content.replace(/@everyone/g, '@.everyone')
                                        console.log('Timed user out.');
                                        client.channels.fetch(info.logID).then(channel => {
                                        channel.send(">>> " + "Timed out user <@" + message.author + "> for " + info.timeoutTime + " milliseconds due to slur at " + message.url + "\n Message content: \"" + log + "\"");
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
                message.reply('Successful test, attempting timeout...', { message_reference: { message_id: message.id, fail_if_not_exists: false } });
                //Attempt timeout
                message.guild.members.fetch(message.author)
                .then(member => {
                    // Use the guild member timeout method
                    member.timeout(info.timeoutTime,'Slur Detected')
                        .then(() => {
                            const replace = '@everyone'

                            const log = message.content.replace(/@everyone/g, '@.everyone')
                            console.log('Timed user out.');
                            client.channels.fetch(info.logID).then(channel => {
                            channel.send(">>> " + "Timed out user <@" + message.author + "> for " + info.timeoutTime + " milliseconds due to test at " + message.url + "\n Message content: \"" + log + "\"");
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
                message.reply('<a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> SLUR DETECTED <a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> \n KNIGHTS ENGAGE', { message_reference: { message_id: message.id, fail_if_not_exists: false } });
            }
            }
        }

        if ((Math.floor(Math.random() * 1337)) == 256) {
            message.reply('Message approved, thank you Citizen.');
        }
    } catch (error) {
        console.log(error)
        const fs = require('fs');
        const time = new Date().toISOString().replace(/:/g, '-'); // Generating a timestamp in a format suitable for file name
        const filePath = `Crash/${time}.txt`;
        const errorString = JSON.stringify(error, null, 2); // Stringify the error object with pretty formatting
    
        fs.writeFile(filePath, errorString, (err) => {
            if (err) {
                console.error('Error writing to crash file:', err);
            } else {
                console.log('Error logged to:', filePath);
            }
        });
    }
    
});

client.on('guildMemberAdd', (member) => {
    try {
        let info = require("./guilds/" + member.guild.id + ".json");
        if (info.welcomeUsers && (Math.floor(Math.random() * 10) == 3)) {
            let reply = {
                stickers: client.guilds.cache.get(member.guild.id).stickers.cache.filter(s => s.id === info.welcomeSticker)
        }
        client.channels.fetch(info.welcomeID).then(channel => {
            channel.send(reply);
            })
        }
    } catch (error) {
        console.log(error)
        const fs = require('fs');
        const time = new Date().toISOString().replace(/:/g, '-'); // Generating a timestamp in a format suitable for file name
        const filePath = `Crash/${time}.txt`;
        const errorString = JSON.stringify(error, null, 2); // Stringify the error object with pretty formatting
    
        fs.writeFile(filePath, errorString, (err) => {
            if (err) {
                console.error('Error writing to crash file:', err);
            } else {
                console.log('Error logged to:', filePath);
            }
        });
    }
    
});

  

// Log in to Discord with your client's token
client.login(token).catch(console.error);
