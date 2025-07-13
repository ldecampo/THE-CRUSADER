const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removeqotd')
		.setDescription('Removes your question from the pool of random questions every day.'),
	async execute(interaction) {
        const authorID = interaction.member.id;
        try {
            const guildId = interaction.guild.id;
            const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);


            // Read JSON file
            let serverInfo = require(filePath); 

            const questionIndex = serverInfo.questionAuthors.indexOf(authorID);

            if (!serverInfo.allowQOTD) {
                interaction.reply("This server does not allow the QOTD. Contact an admin!");
            } else if (serverInfo.questionChannel == "") {
                interaction.reply("This server has not set a question channel, have an admin use /setqotdchannel in the channel where the QOTD should be asked.")
            } else if (questionIndex == -1) {
                interaction.reply("You haven't asked a question! Used /addquotd to add a question.")
            } else {

                serverInfo.questionsArray.splice(questionIndex, 1);
                serverInfo.questionAuthors.splice(questionIndex, 1);

                
                // Write JSON data back to file
                fs.writeFileSync(filePath, JSON.stringify(serverInfo, null, 2)); // Pretty print JSON

                // Reply to interaction
                interaction.reply("Question removed!");
            }
        } catch (Exception) {
            interaction.reply("Error removing question")
            console.log(Exception)
        }
    },
};