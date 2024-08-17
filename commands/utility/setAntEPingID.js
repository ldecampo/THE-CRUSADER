const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setanteroleid')
		.setDescription('Set this role to be pung when a message conntaining e is sent during antE mode.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addStringOption(option =>
			option.setName('id')
				.setDescription('The role id')
				.setRequired(true)),
	async execute(interaction) {
        const role = interaction.options.getString('id');
        console.log(role)
        try {
            const guildId = interaction.guild.id;
            const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);
            console.log(role)

            // Check if time is valid
            if (!role) {
                return interaction.reply("Invalid role ID");
            }

            // Read JSON file
            let serverInfo = require(filePath); 
            serverInfo.antERoleID = role;

            
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