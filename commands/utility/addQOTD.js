const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addqotd')
		.setDescription('Adds your question to the pool of random questions every day!')
		.addStringOption(option =>
			option.setName('question')
				.setDescription('Your question')
				.setRequired(true)),
	async execute(interaction) {
        const question = interaction.options.getString('question');
        const authorID = interaction.member.id;
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

            const hasAsked = serverInfo.questionAuthors.indexOf(authorID);

            if (!serverInfo.allowQOTD) {
                interaction.reply("This server does not allow the QOTD. Contact an admin!");
            } else if (serverInfo.questionChannel == "") {
                interaction.reply("This server has not set a question channel, have an admin use /setqotdchannel in the channel where the QOTD should be asked.")
            } else if (hasAsked != -1) {
                interaction.reply("You already asked a question! Used /removeqotd to delete it, then you may ask a new question.")
            } else {

                serverInfo.questionsArray.push(question);
                serverInfo.questionAuthors.push(authorID);

                
                // Write JSON data back to file
                fs.writeFileSync(filePath, JSON.stringify(serverInfo, null, 2)); // Pretty print JSON

                // Reply to interaction
                interaction.channel.send("Question added! Ignore the no reply message, it's to protect your question!");
            }
        } catch (Exception) {
            interaction.channel.send("Error adding question")
            console.log(Exception)
        }
    },
};