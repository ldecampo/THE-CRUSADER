const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('catslurs')
		.setDescription('Returns an ordered list of all the disallowed words.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction) {
		const guildId = interaction.guild.id;
		const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);
		let serverInfo = require(filePath);
		let reply = "";

		for (let i = 0; i < serverInfo.slurList.length; i++) {
			console.log(i)
			reply = reply + i.toString() + ": " + serverInfo.slurList[i] + `\n`
		}

		console.log(reply)
		await interaction.reply(reply);
	},
};