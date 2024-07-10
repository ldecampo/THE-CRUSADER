const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('respectful')
		.setDescription('respect'),
	async execute(interaction) {
		try {
			let delay = async (ms) => await new Promise(r => setTimeout(r, ms));
			async function dmRESPECT(iterator, user) {
				await delay(1000);
				if (iterator != 0) {
					user.send("<:RESPECTFUL:932004811723931698>");
					iterator = iterator - 1;
					dmRESPECT(iterator, user);
				}
			}

			interaction.member.send("RESPECT.");
			console.log("Beginning Countdown");
			//One second * one minute * one hour * one day * one week
			await delay(1000 * 60 * 60 * 24 * 7);
			console.log("Countdown complete, messaging...")
			interaction.member.send("<:RESPECTFUL:932004811723931698>");
		}
		catch (error) {
			console.log(error);
		}
	},
};