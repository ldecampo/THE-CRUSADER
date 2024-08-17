const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('catante')
		.setDescription('Returns if antE mode is on.'),
	async execute(interaction) {
		const guildId = interaction.guild.id;
		const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);
		let serverInfo = require(filePath); 
		let reply = serverInfo.antEMode.toString(); 
		console.log(reply)
		await interaction.reply(reply);
	},
};