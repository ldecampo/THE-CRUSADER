const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setbaitchannel')
        .setDescription('Registers the current channel as the bait channel to the bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        try {
            const guildId = interaction.guild.id;
            const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);
            const channelID = interaction.channelId
            console.log(channelID)

            // Check if channelID is valid
            if (!channelID) {
                return interaction.reply("Invalid channel ID");
            }

            // Read JSON file
            let serverInfo = require(filePath);

            // Update pinID in JSON data
            serverInfo.pinID = channelID;

            // Write JSON data back to file
            fs.writeFileSync(filePath, JSON.stringify(serverInfo, null, 2)); // Pretty print JSON

            // Reply to interaction
            interaction.reply("Channel set");
        } catch (error) {
            console.error(error);
            interaction.reply("Error setting channel");
        }
    },
};