const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removesillyslur')
		.setDescription('Removes a specific word from the list of silly words.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addIntegerOption(option =>
			option.setName('wordnumber')
				.setDescription('The number of the word to remove (see /catsillyslurs)')
				.setRequired(true)),
	async execute(interaction) {
        const index = interaction.options.getInteger('wordnumber');
        console.log(index)
        try {
            const guildId = interaction.guild.id;
            const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);

            // Check if index is valid
            if (!index) {
                return interaction.reply("Invalid word");
            }

            // Read JSON file
            let serverInfo = require(filePath); 
            serverInfo.sillySlurList.splice(index, 1);

            
            // Write JSON data back to file
            fs.writeFileSync(filePath, JSON.stringify(serverInfo, null, 2)); // Pretty print JSON

            // Reply to interaction
            interaction.reply("Question removed!");
        } catch (Exception) {
            interaction.reply("Error adding question")
            console.log(Exception)
        }
    },
};