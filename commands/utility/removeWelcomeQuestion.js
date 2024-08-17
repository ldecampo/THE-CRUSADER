const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removewelcomequestion')
		.setDescription('Removes a specific question from the list of welcoming questions.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addIntegerOption(option =>
			option.setName('questionnumber')
				.setDescription('The number of the question to remove (see /catwelcomequestions)')
				.setRequired(true)),
	async execute(interaction) {
        const index = interaction.options.getInteger('questionnumber');
        console.log(index)
        try {
            const guildId = interaction.guild.id;
            const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);

            // Check if index is valid
            if (!index) {
                return interaction.reply("Invalid question");
            }
            if (index <= 2) {
                return interaction.reply("Question number must be larger than 2.")
            }

            // Read JSON file
            let serverInfo = require(filePath); 
            serverInfo.welcomeQuestions.splice(index, 1);

            
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