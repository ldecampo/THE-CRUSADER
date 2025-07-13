const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('allowqotd')
		.setDescription('Enable/Disable the QOTD for this server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addBooleanOption(option =>
			option.setName('truefalse')
				.setDescription('Enable/Disable QOTD')
				.setRequired(true)),
	async execute(interaction) {
		const bool = interaction.options.getBoolean('truefalse');
        console.log(bool)
        try {
            const guildId = interaction.guild.id;
            const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);
            console.log(bool)


            // Read JSON file
            let serverInfo = require(filePath); 
            serverInfo.allowQOTD = bool;

            
            // Write JSON data back to file
            fs.writeFileSync(filePath, JSON.stringify(serverInfo, null, 2)); // Pretty print JSON

            // Reply to interaction
            interaction.reply("List looping toggled");
        } catch (Exception) {
            interaction.reply("Error toggling mode")
            console.log(Exception)
        } 
	},
};
