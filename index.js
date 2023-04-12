let secrets = require('./secrets.json');
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');
const { Client, GatewayIntentBits, PermissionFlagsBits } = require('discord.js');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

const rest = new REST({ version: '9' }).setToken(secrets.token);


const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('safe')
	.setDescription('Turns safemode on or off')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setRequired(true)
      .addChoices(
				{ name: 'On', value: 'on' },
				{ name: 'Off', value: 'off' })
      );



const unsafeWords = require('./slurs.json'); // List of words to listen for

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
  if (unsafeWords.slurs.some(word => message.content.toLowerCase().includes(word))) {
    message.reply('<a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> SLUR DETECTED <a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167><a:alert:1095711502683611167> \n <@&1095738454157041725> ENGAGE');
  }
});

// (async () => {
// 	try {
// 		console.log('Started refreshing application (/) commands.');

// 		await rest.put(
// 			Routes.applicationCommands(secrets.appid),
// 			{ body: data },
// 		);

// 		console.log('Successfully reloaded application (/) commands.');
// 	} catch (error) {
// 		console.error(error);
// 	}
// })();

// client.on('interactionCreate', async interaction => {
// 	if (!interaction.isCommand()) return;
//   console.log(interaction);
//   if (interaction.commandName === 'safe') {
//     await interaction.reply('Success');
//   }
// });

// client.on('interactionCreate', async interaction => {
//   console.log(interaction);
//   if (!interaction.isCommand()) return;

//   if (interaction.commandName === 'safe') {
//     const member = interaction.member;
//     console.log("Command Recieved")

//     // // Check if user has the required role
//     // if (!member.roles.cache.has('<Respect Promoter #ID>')) {
//     //   return interaction.reply('You do not have the required role to use this command.');
//     // }

//     // Check if user provided valid input for the command
//     const onOff = interaction.options.getString('onOff');
//     if (!onOff || (onOff !== 'on' && onOff !== 'off')) {
//       return interaction.reply('Please provide a valid option for this command: on or off.');
//     }

//     if (onOff === 'on') {
//       // Listen for messages containing safe words
//       client.on('messageCreate', async message => {
//         console.log(message);
//         if (unsafeWords.some(word => message.content.toLowerCase().includes(word))) {
//           message.reply('<Warning Message>');
//         }
//       });

//       interaction.reply('The bot is now listening for messages containing safe words.');
//     } else {
//       // Stop listening for messages containing safe words
//       client.removeAllListeners('messageCreate');
//       interaction.reply('The bot is no longer listening for messages containing safe words.');
//     }
//   }
// });

client.login(secrets.token);