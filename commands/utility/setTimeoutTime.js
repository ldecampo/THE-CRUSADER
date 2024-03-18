const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settimeouttime')
		.setDescription('Set how long people will be timed out, in milliseconds.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addIntegerOption(option =>
			option.setName('time')
				.setDescription('How long to time people out')
				.setRequired(true)),
	async execute(interaction) {
		const time = interaction.options.getInteger('time');
        console.log(time)
        try {
            const guildId = interaction.guild.id;
            const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);
            console.log(time)

            // Check if time is valid
            if (!time) {
                return interaction.reply("Invalid channel ID");
            }

            // Read JSON file
            let serverInfo = require(filePath); 
            serverInfo.timeoutTime = time;

            
            // Write JSON data back to file
            fs.writeFileSync(filePath, JSON.stringify(serverInfo, null, 2)); // Pretty print JSON

            // Reply to interaction
            interaction.reply("Time set");
        } catch (Exception) {
            interaction.reply("Error setting channel")
            console.log(Exception)
        } 
	},
};
