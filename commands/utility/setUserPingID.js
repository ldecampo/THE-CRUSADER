const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setuserroleid')
		.setDescription('Set this role to be given to users if they send an acceptable message.')
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

            // Check if role is valid
            if (!role) {
                return interaction.reply("Invalid role ID");
            }

            // Read JSON file
            let serverInfo = require(filePath); 
            serverInfo.userRoleID = role;

            
            // Write JSON data back to file
            fs.writeFileSync(filePath, JSON.stringify(serverInfo, null, 2)); // Pretty print JSON

            // Reply to interaction
            interaction.reply("Role set");
        } catch (Exception) {
            interaction.reply("Error setting channel")
            console.log(Exception)
        }
    },
};