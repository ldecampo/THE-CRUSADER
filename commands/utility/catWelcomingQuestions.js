const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('catwelcomequestions')
		.setDescription('Returns an ordered list of all the welcoming questions.'),
	async execute(interaction) {
		const guildId = interaction.guild.id;
		const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);
		let serverInfo = require(filePath);
		let reply = "";

		for (let i = 0; i < serverInfo.welcomeQuestions.length; i++) {
			console.log(i)
			reply = reply + i.toString() + ": " + serverInfo.welcomeQuestions[i] + `\n`
		}

		console.log(reply)
		await interaction.reply(reply);
	},
};