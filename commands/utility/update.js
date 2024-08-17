const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription('Update the server info to the bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction) {
        const guildId = interaction.guild.id;
        const path = require('path')
        const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);
        var tryUpdate = true

        try {
            await fs.promises.access(filePath, fs.constants.F_OK);
            // File exists, continue with processing
        } catch (err) {
            // Handle error, file doesn't exist
            interaction.reply("Error: server not registered");
            tryUpdate = false;
        }


        if (tryUpdate) {
            let currInfo = require(filePath); 
                
                //Check if array vars have been defined. Keep their value if they do.

                //blacklistedIds
                if (typeof currInfo.blacklistedIds === 'undefined' || currInfo.blacklistedIds === null) {
                    var blacklistedChannels = [];
                } else {
                    var blacklistedChannels = currInfo.blacklistedIds
                }

                //logID
                if (typeof currInfo.logID === 'undefined' || currInfo.logID === null) {
                    var logID = "";
                } else {
                    var logID = currInfo.logID
                }

                //pinID
                if (typeof currInfo.pinID === 'undefined' || currInfo.pinID === null) {
                    var pinID = "";
                } else {
                    var pinID = currInfo.pinID
                }

                //roleID -> knightRoleID 
                if (!(typeof currInfo.knightRoleID === 'undefined' || currInfo.knightRoleID === null)) {
                    var knightRoleID = knightRoleID
                }
                else if (typeof currInfo.roleID === 'undefined' || currInfo.roleID === null) {
                    var knightRoleID = "";
                } else {
                    var knightRoleID = currInfo.roleID
                }

                //userRoleID
                if (typeof currInfo.userRoleID === 'undefined' || currInfo.userRoleID === null) {
                    var userRoleID = "";
                } else {
                    var userRoleID = currInfo.userRoleID;
                }

                //antEMode
                if (typeof currInfo.antEMode === 'undefined' || currInfo.antEMode === null) {
                    var antEMode = "";
                } else {
                    var antEMode = currInfo.antEMode;
                }

                //antERoleID
                if (typeof currInfo.antERoleID === 'undefined' || currInfo.antERoleID === null) {
                    var antERoleID = "";
                } else {
                    var antERoleID = currInfo.antERoleID;
                }

                //baitID
                if (typeof currInfo.baitID === 'undefined' || currInfo.baitID === null) {
                    var baitID = "";
                } else {
                    var baitID = currInfo.baitID;
                }

                //timeoutTime
                if (typeof currInfo.timeoutTime === 'undefined' || currInfo.timeoutTime === null) {
                    var timeoutTime = 0;
                } else {
                    var timeoutTime = currInfo.timeoutTime
                }

                //welcomeUsers
                if (typeof currInfo.welcomeUsers === 'undefined' || currInfo.welcomeUsers === null) {
                    var welcomeUsers = false;
                } else {
                    var welcomeUsers = currInfo.welcomeUsers
                }

                //welcomeID
                if (typeof currInfo.welcomeID === 'undefined' || currInfo.welcomeID === null) {
                    var welcomeID = "";
                } else {
                    var welcomeID = currInfo.welcomeID
                }

                //welcomeSticker
                if (typeof currInfo.welcomeSticker === 'undefined' || currInfo.welcomeSticker === null) {
                    var blacklistedChannels = "";
                } else {
                    var welcomeSticker = currInfo.welcomeSticker
                }

                //countingID
                if (typeof currInfo.countingID === 'undefined' || currInfo.countingID === null) {
                    var countingID = "";
                } else {
                    var countingID = currInfo.countingID
                }

                //welcomeQuestions
                if (typeof currInfo.welcomeQuestions === 'undefined' || currInfo.welcomeQuestions === null) {
                    var welcomeQuestions = ["What is 1+1", "Opinion on orphans?", "Tell me your favorite proof."];
                } else {
                    var welcomeQuestions = currInfo.welcomeQuestions
                }
                
                //pins
                if (typeof currInfo.pins === 'undefined' || currInfo.pins === null) {
                    var examplePins = [1, 2, 3];
                } else {
                    var examplePins = currInfo.pins
                }

                var jsonArray = { 
                    "guildId"  :  interaction.guild.id, 
                    "blacklistedIds" : blacklistedChannels,
                    "logID"   :  logID, 
                    "pinID"      :  pinID,
                    "knightRoleID"     : knightRoleID,
                    "userRoleID"    : userRoleID,
                    "antEMode"      : antEMode,
                    "antERoleID"    : antERoleID,
                    "baitID"    : baitID,
                    "timeoutTime"       :  timeoutTime,
                    "welcomeUsers"      : welcomeUsers,
                    "welcomeID"     : welcomeID,
                    "welcomeSticker"    : welcomeSticker,
                    "countingID"    : countingID,
                    "welcomeQuestions"      : welcomeQuestions,
                    "pins"      : examplePins,
                    }
                
                
                // Convert JSON object to a formatted string with proper spacing
                const jsonString = JSON.stringify(jsonArray, null, 2);

                // Write the formatted JSON string to file
                require("fs").writeFileSync(filePath, jsonString);

                interaction.reply("Server updated")
                }
	},
};
