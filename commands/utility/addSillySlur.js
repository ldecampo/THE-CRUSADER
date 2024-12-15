const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addsillyslur')
		.setDescription('Adds a word to the list of silly words!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addStringOption(option =>
			option.setName('word')
				.setDescription('The word to make silly')
				.setRequired(true)),
	async execute(interaction) {
        const word = interaction.options.getString('word');
        console.log(word);
        try {
            const guildId = interaction.guild.id;
            const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);

            // Check if time is valid
            if (!word) {
                return interaction.reply("Invalid word");
            }

            // Read JSON file
            let serverInfo = require(filePath); 
            serverInfo.sillySlurList.push(word);

            
            // Write JSON data back to file
            fs.writeFileSync(filePath, JSON.stringify(serverInfo, null, 2)); // Pretty print JSON

            // Reply to interaction
            interaction.reply("Word added!");
        } catch (Exception) {
            interaction.reply("Error adding word")
            console.log(Exception)
        }
    },
};