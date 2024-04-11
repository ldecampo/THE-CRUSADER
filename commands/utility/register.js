const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Registers the server to the bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction) {
        const filePath = './guilds/' + interaction.guild.id + '.json';

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                var examplePins = [1, 2, 3]
                var blacklistedChannels = []
                var jsonArray = { 
                    "guildId"  :  interaction.guild.id, 
                    "blacklistedIds" : blacklistedChannels,
                    "logID"   :  "", 
                    "pinID"      :  "",
                    "roleID"     : "",
                    "baitID"    : "",
                    "timeoutTime"       :  0,
                    "welcomeUsers"      : false,
                    "welcomeID"     : "",
                    "welcomeSticker"    : "",
                    "countingID"    : "",
                    "pins"      : examplePins,
                    }
                
                require("fs").writeFileSync(filePath, JSON.stringify(jsonArray));
                interaction.reply("Server registered")

            } else {
                interaction.reply("Error: server already registered")
            }
          });

	},
};
