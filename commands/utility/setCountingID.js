const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setcountingid')
		.setDescription('Set the ID of the counting channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addStringOption(option =>
			option.setName('id')
				.setDescription('The channel id')
				.setRequired(true)),
	async execute(interaction) {
        const channel = interaction.options.getString('id');
        console.log(channel)
        try {
            const guildId = interaction.guild.id;
            const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);
            console.log(channel)

            // Check if channel is valid
            if (!channel) {
                return interaction.reply("Invalid role ID");
            }

            // Read JSON file
            let serverInfo = require(filePath); 
            serverInfo.countingID = channel;

            
            // Write JSON data back to file
            fs.writeFileSync(filePath, JSON.stringify(serverInfo, null, 2)); // Pretty print JSON

            // Reply to interaction
            interaction.reply("Counting channel set");
        } catch (Exception) {
            interaction.reply("Error setting channel")
            console.log(Exception)
        }
    },
};