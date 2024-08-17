const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addwelcomequestion')
		.setDescription('Adds your question to the pool of random questions when greeting users!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
		.addStringOption(option =>
			option.setName('question')
				.setDescription('Your question')
				.setRequired(true)),
	async execute(interaction) {
        const question = interaction.options.getString('question');
        console.log(question)
        try {
            const guildId = interaction.guild.id;
            const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);

            // Check if time is valid
            if (!question) {
                return interaction.reply("Invalid question");
            }

            // Read JSON file
            let serverInfo = require(filePath); 
            serverInfo.welcomeQuestions.push(question);

            
            // Write JSON data back to file
            fs.writeFileSync(filePath, JSON.stringify(serverInfo, null, 2)); // Pretty print JSON

            // Reply to interaction
            interaction.reply("Question added!");
        } catch (Exception) {
            interaction.reply("Error adding question")
            console.log(Exception)
        }
    },
};