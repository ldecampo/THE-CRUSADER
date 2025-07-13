// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');

const { Client, Events, Collection, GatewayIntentBits, ActivityType } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');

let secrets = require('./config.json');
const unsafeWords = require('./tests.json');
const { info } = require('node:console');

// Helper function to safely fetch channels
async function safeChannelFetch(client, channelId, context = 'unknown') {
    try {
        if (!channelId) {
            console.log(`[WARNING] No channel ID provided for context: ${context}`);
            return null;
        }
        
        const channel = await client.channels.fetch(channelId);
        if (!channel) {
            console.log(`[WARNING] Channel ${channelId} not found for context: ${context}`);
            return null;
        }
        
        return channel;
    } catch (error) {
        console.error(`[ERROR] Failed to fetch channel ${channelId} for context: ${context}`, error.message);
        return null;
    }
}

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers
    ],
    partials: ['CHANNEL']
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.once(Events.ClientReady, async readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    client.user.setPresence({
        activities: [{ name: `im probably working fine`, type: ActivityType.Custom }],
        status: 'online',
    });

    let hourLoop = 24;

    while (true) {
        try {
            let master = JSON.parse(fs.readFileSync("./lists/master.json", 'utf8'));
            let info;
            let guildId;
            
            for (let i = 0; i < master.listInfo.length; i++) {
                if (master.listInfo[i].isLooping) {
                    console.log('List info:', master.listInfo[i]);
                    console.log('Guild ID:', master.listInfo[i].loopingGuild);

                    guildId = String(master.listInfo[i].loopingGuild);
                    
                    try {
                        info = JSON.parse(fs.readFileSync(`./guilds/${guildId}.json`, 'utf8'));
                    } catch (fileError) {
                        console.error(`[ERROR] Failed to read guild config for ${guildId}:`, fileError.message);
                        continue;
                    }
                    
                    if (info.allowLoopedLists === true) {
                        const channel = await safeChannelFetch(client, master.listInfo[i].loopingChannel, 'looped list');
                        if (!channel) {
                            console.log(`[WARNING] Skipping looped list ${master.listInfo[i].id} - channel not accessible`);
                            continue;
                        }
                        
                        try {
                            const listPath = path.resolve(__dirname, `./lists/${master.listInfo[i].id}_${master.listInfo[i].owner}.json`);
                            const listItems = JSON.parse(fs.readFileSync(listPath, 'utf8'));
                            
                            let endingString = "";
                            if (!listItems.items || listItems.items.length === 0) {
                                endingString = "No entries yet";
                            } else {
                                for (let j = 0; j < listItems.items.length; j++) {
                                    endingString += `\`${j}.\` ${listItems.items[j]}\n`;
                                }
                            }
                            
                            const owner = await channel.guild.members.fetch(master.listInfo[i].owner);
                            const embed = new EmbedBuilder()
                                .setColor('8C6E0F')
                                .setTitle(master.listInfo[i].name)
                                .setDescription(`By ${owner.displayName}`)
                                .addFields({ name: 'Entries:', value: endingString });
                            
                            await channel.send({ embeds: [embed] });
                        } catch (error) {
                            console.error(`[ERROR] Error processing looped list ${master.listInfo[i].id}:`, error.message);
                        }
                    }



                }
            }
        } catch (error) {
            console.error('[ERROR] Error in main loop:', error.message);
        }
        if (hourLoop == 24) {
            hourLoop = 0;
            const guildFolder = './guilds/';
            fs.readdir(guildFolder, (err, files) => {
                files.forEach(async infoFile => {
                    console.log(infoFile);

                    const filePath = path.join(guildFolder, infoFile);

                    try {
                        const data = fs.readFileSync(filePath, 'utf8');
                        let info = JSON.parse(data);

                        console.log(info.allowQOTD);
                        if (info.allowQOTD === true && info.questionChannel != "") {
                                try {
                                    if (info.questionsArray.length == 0) {
                                        const questionChannel = await safeChannelFetch(client, info.questionChannel, 'QOTD');
                                        await questionChannel.send("I have no questions! Add some with `/addqotd`.");
                                    } else {
                                        let questionIndex = Math.floor(Math.random() * info.questionsArray.length);
                                        console.log(questionIndex);
                                        let question = info.questionsArray[questionIndex];
                                        let questionAuthorID = info.questionAuthors[questionIndex];
                                        const author = await client.users.fetch(questionAuthorID);
                                        const authorName = author.displayName;
                                        const questionChannel = await safeChannelFetch(client, info.questionChannel, 'QOTD');
                                        const questionEmbed = new EmbedBuilder()
                                            .setColor('8C6E0F')
                                            .setTitle("Question Of The Day!")
                                            .setDescription(question)
                                            .setTimestamp()
                                            .setFooter({ text: `Question by ${authorName}` });
                                        
                                        await questionChannel.send({ embeds: [questionEmbed] });

                                        info.questionsArray.splice(questionIndex, 1);
                                        info.questionAuthors.splice(questionIndex, 1);
                                        fs.writeFileSync(filePath, JSON.stringify(info, null, 2)); // Pretty print JSON
                                        info = null;
                                    }
                                } catch (e) {
                                    console.error(`[ERROR] Error processing QOTD:`, e.message);
                                }
                            }
                    } catch (e) {
                    console.error(`[ERROR] Error processing QOTD:`, e.message);
                    }
                });
            });
        }

        await new Promise(resolve => setTimeout(resolve, 3600000));
        console.log("Looping once more...");
        hourLoop++;
        console.log("Hour number " + hourLoop);
    }
});

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

        let messages = await channel.messages.fetchPinned();
        let lastPinned = messages.first();

        let shouldLog = true;
        if (info.pins.includes(lastPinned.url)) {
            shouldLog = false;
        }

        if (shouldLog) {
            info.pins.push(lastPinned.url);
            require("fs").writeFileSync("./pins.json", JSON.stringify(info));

            let messageContent = "<@" + lastPinned.author.id + ">'s message pinned! " + lastPinned.url + "\n>>> " + lastPinned.content;

            const pinChannel = await safeChannelFetch(client, info.pinID, 'pin logging');
            if (pinChannel) {
                try {
                    await pinChannel.send(messageContent);
                    console.log("Regular message sent successfully.");

                    // Send URLs for each attachment in a separate message
                    for (const attachment of lastPinned.attachments.values()) {
                        try {
                            await pinChannel.send(attachment.url);
                            console.log("Attachment URL sent successfully.");
                        } catch (error) {
                            console.error("Error sending attachment URL:", error.message);
                        }
                    }
                } catch (error) {
                    console.error("Error sending pin message:", error.message);
                }
            }
        }
    } catch (error) {
        console.error('[ERROR] Error in channelPinsUpdate:', error.message);
        logError(error);
    }
});

client.on("messageCreate", async (message) => {
    try {
        if (!message.guild) return; // Skip DMs
        
        let info;
        try {
            info = require("./guilds/" + message.guild.id + ".json");
        } catch (fileError) {
            console.error(`[ERROR] Failed to read guild config for ${message.guild.id}:`, fileError.message);
            return;
        }
        
        let grantFull = true;

        // Anti-E mode
        if (message.content.toLowerCase().includes("e") && message.author.id !== '1095366459191984198') {
            if (info.antEMode == true) {
                grantFull = false;
                message.reply('<a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> E DETECTED <a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> \n <@&' + info.antERoleID + '> ENGAGE \n TIMING OUT MEMBER FOR 10 MINUTES', { message_reference: { message_id: message.id, fail_if_not_exists: false } });
                
                try {
                    const member = await message.guild.members.fetch(message.author);
                    await member.timeout(info.timeoutTime, 'E Detected');
                    console.log('Timed user out for E.');
                    
                    const logChannel = await safeChannelFetch(client, info.logID, 'E detection logging');
                    if (logChannel) {
                        const log = message.content.replace(/@everyone/g, '@.everyone');
                        await logChannel.send(">>> " + "Timed out user <@" + message.author + "> for " + info.timeoutTime + " milliseconds due to E at " + message.url + "\n Message content: \"" + log + "\"");
                    }
                } catch (error) {
                    console.error('Error timing out user for E:', error.message);
                }
            }
        }

        // Discord invite detection
        if (message.content.includes("discord.gg")) {
            if (message.author.id !== '1095366459191984198') {
                grantFull = false;
                const log = message.content.replace(/@everyone/g, '@.everyone');
                const author = message.author;
                const id = message.id;

                try {
                    await message.reply('Invite link detected, deleting...', { message_reference: { message_id: id, fail_if_not_exists: false } });
                    await message.delete();
                    
                    const logChannel = await safeChannelFetch(client, info.logID, 'invite link logging');
                    if (logChannel) {
                        await logChannel.send(">>> " + "Deleted message from user <@" + author + "> due to discord invite." + "\n Message content: \"" + log + "\"");
                    }
                } catch (error) {
                    console.error('Error handling invite link:', error.message);
                }
            }
        }

        // Test words
        if (message.author.id !== '1095366459191984198') {
            for (let word of unsafeWords.test) {
                if (message.content.toLowerCase().includes(word)) {
                    message.reply('Successful test.', { message_reference: { message_id: message.id, fail_if_not_exists: false } });
                    console.log("Message heard.");
                }
            }
        }

        // Slur detection
        if (message.author.id !== '1095366459191984198') {
            for (let word of info.slurList) {
                if (message.content.toLowerCase().includes(word)) {
                    grantFull = false;
                    message.reply('<a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> SLUR DETECTED <a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> \n <@&' + info.knightRoleID + '> ENGAGE \n TIMING OUT MEMBER FOR 10 MINUTES', { message_reference: { message_id: message.id, fail_if_not_exists: false } });
                    
                    const log = message.content.replace(/@everyone/g, '@.everyone');
                    const logChannel = await safeChannelFetch(client, info.logID, 'slur detection logging');
                    if (logChannel) {
                        await logChannel.send(">>> " + "Attempting to time out user <@" + message.author + "> for " + info.timeoutTime + " milliseconds due to slur at " + message.url + "\n Message content: \"" + log + "\"");
                    }
                    
                    try {
                        const member = await message.guild.members.fetch(message.author);
                        await member.timeout(info.timeoutTime, 'Slur Detected');
                        console.log('Timed user out for slur.');
                        if (logChannel) {
                            await logChannel.send("Success.");
                        }
                    } catch (error) {
                        console.error('Error timing out user for slur:', error.message);
                    }
                }
            }
        }

        // Timeout test
        if (message.author.id !== '1095366459191984198') {
            for (let word of unsafeWords.timeOutTest) {
                if (message.content.toLowerCase().includes(word)) {
                    message.reply('Successful test, attempting timeout...', { message_reference: { message_id: message.id, fail_if_not_exists: false } });
                    
                    try {
                        const member = await message.guild.members.fetch(message.author);
                        await member.timeout(info.timeoutTime, 'Timeout Test');
                        console.log('Timed user out for test.');
                        
                        const logChannel = await safeChannelFetch(client, info.logID, 'timeout test logging');
                        if (logChannel) {
                            const log = message.content.replace(/@everyone/g, '@.everyone');
                            await logChannel.send(">>> " + "Timed out user <@" + message.author + "> for " + info.timeoutTime + " milliseconds due to test at " + message.url + "\n Message content: \"" + log + "\"");
                        }
                    } catch (error) {
                        console.error('Error timing out user for test:', error.message);
                    }
                }
            }
        }

        // Silly words
        if (message.author.id !== '1095366459191984198') {
            for (let word of info.sillySlurList) {
                if (message.content.toLowerCase().includes(word)) {
                    grantFull = false;
                    let rand = Math.floor(Math.random() * 10);
                    if (rand == 3) {
                        message.reply('<a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> SLUR DETECTED <a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> \n KNIGHTS ENGAGE', { message_reference: { message_id: message.id, fail_if_not_exists: false } });
                    }
                }
            }
        }

        // Random approval message
        if ((Math.floor(Math.random() * 2674)) == 256) {
            message.reply('Message approved, thank you Citizen.');
        }

        // Welcome users
        if (grantFull && info.welcomeUsers && message.content !== "") {
            try {
                let defaultRole = message.guild.roles.cache.get(info.userRoleID);
                
                if (defaultRole && !message.member.roles.cache.has(defaultRole.id)) {
                    await message.member.roles.add(defaultRole);
                    message.reply('Congratulations! You have solved an impossible puzzle, and thus will be allowed to see all that our glorious kingdom has to offer. Behold, a new citizen has joined the kingdom!');
                    
                    const logChannel = await safeChannelFetch(client, info.logID, 'user verification logging');
                    if (logChannel) {
                        await logChannel.send(">>> " + "Gave user <@" + message.author + "> default user role due to verification at " + message.url + "\n Message content: \"" + message.content + "\"");
                    }
                }
            } catch (error) {
                console.error('Error adding user role:', error.message);
            }
        }

    } catch (error) {
        console.error('[ERROR] Error in messageCreate:', error.message);
        logError(error);
    }
});

client.on('guildMemberAdd', async member => {
    console.log(`${member.user.tag} has joined the server!`);
    try {
        let info;
        try {
            info = require("./guilds/" + member.guild.id + ".json");
        } catch (fileError) {
            console.error(`[ERROR] Failed to read guild config for ${member.guild.id}:`, fileError.message);
            return;
        }
        
        if (info.welcomeUsers == true) {
            const welcomeChannel = await safeChannelFetch(client, info.welcomeID, 'welcome message');
            if (!welcomeChannel) {
                console.log(`[WARNING] Welcome channel not found for guild ${member.guild.id}`);
                return;
            }
            
            try {
                let reply = {
                    stickers: client.guilds.cache.get(member.guild.id).stickers.cache.filter(s => s.id === info.welcomeSticker)
                };

                await welcomeChannel.send(reply);
                await welcomeChannel.send("Welcome Citizen <@" + member.id + ">! If you wish to join the rest of the server, please answer one of my riddles three! (Or just like... say anything I guess, that's fine too)");
                
                let questionList = info.welcomeQuestions;
                const getRandomQuestion = (max) => questionList[Math.floor(Math.random() * max)];
                
                let question1 = getRandomQuestion(questionList.length);
                let question2 = getRandomQuestion(questionList.length);
                let question3 = getRandomQuestion(questionList.length);

                console.log(question1 + question2 + question3);
                await welcomeChannel.send(`- ${question1} \n- ${question2} \n- ${question3}`);
            } catch (error) {
                console.error('Error sending welcome message:', error.message);
            }
        }
    } catch (error) {
        console.error('[ERROR] Error in guildMemberAdd:', error.message);
        logError(error);
    }
});

// Error logging function
function logError(error) {
    try {
        const fs = require('fs');
        const time = new Date().toISOString().replace(/:/g, '-');
        const filePath = `Crash/${time}.txt`;
        const errorString = JSON.stringify(error, null, 2);

        fs.writeFile(filePath, errorString, (err) => {
            if (err) {
                console.error('Error writing to crash file:', err);
            } else {
                console.log('Error logged to:', filePath);
            }
        });
    } catch (logError) {
        console.error('Failed to log error:', logError.message);
    }
}

// Log in to Discord with your client's token
client.login(token).catch(console.error);