const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('respectful')
		.setDescription('Respect'),
	async execute(interaction) {
		let delay = async (ms) => await new Promise(r => setTimeout(r,ms));
		async function dmRESPECT(iterator, user) {
			await delay(1000);
			if (iterator != 0) {
				user.send("<:RESPECTFUL:932004811723931698>");
				iterator = iterator - 1;
				dmRESPECT(iterator, user);
			}
		}

		interaction.member.send("RESPECT.");
		//One second * one minute * one hour * one day * one week
		await delay(1000 * 60 );
		dmRESPECT(100, interaction.member);
		interaction.member.send("RESPECT.");
	},
};