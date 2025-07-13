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
                var examplePins = [1, 2, 3];
                var blacklistedChannels = [];
                var exampleSlurs = ["instancetest6541691351398451561"];
                var sillySlurs = ["french"];
                var exampleQuestions = ["Prove that the square root of 2 is an irrational number, or that there are infinitely many primes.", "What is your least favorite imaginary number?", "Give an in-depth analysis about why proof by induction is a valid proof technique."];
                var jsonArray = { 
                    "guildId"  :  interaction.guild.id, 
                    "blacklistedIds" : blacklistedChannels,
                    "logID"   :  "", 
                    "pinID"      :  "",
                    "knightRoleID"     : "",
                    "userRoleID"    : "",
                    "antEMode"      : false,
                    "antERoleID"    : "",
                    "baitID"    : "",
                    "timeoutTime"       :  0,
                    "welcomeUsers"      : false,
                    "welcomeID"     : "",
                    "welcomeSticker"    : "",
                    "allowLoopedLists"  : false,
                    "allowQOTD"     : false,
                    "questionChannel"        : "",
                    "countingID"    : "",
                    "slurList"      : exampleSlurs,
                    "sillySlurList" : sillySlurs,
                    "welcomeQuestions"  : exampleQuestions,
                    "questionsArray"    : [],
                    "questionAuthors"   : [],
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
