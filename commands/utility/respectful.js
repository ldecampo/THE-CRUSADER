const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('respectful')
		.setDescription('Respect'),
	async execute(interaction) {
		//One second * one minute * one hour * one day * one week
		await delay(1000 * 60);
		for (let i = 0; i == 100; i++) {
			interaction.member.sendMessage("<a:RESPECTFUL:932004811723931698>");
		}
		interaction.member.sendMessage("RESPECT.");
	},
};