const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('correct')
        .setDescription('Correct a message. This must be done the same channel as the message you wish to correct.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option =>
            option.setName('oldmessageid')
                .setDescription('The ID of the message you wish to correct.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('newmessage')
                .setDescription('The contents of the new message you wish to be sent')
                .setRequired(true)),
    async execute(interaction) {
        const oldid = interaction.options.getString('oldmessageid');
        let correctedMessage = interaction.options.getString('newmessage');

        // Replace any placeholder newline characters with actual newlines
        correctedMessage = correctedMessage.replace(/\\n/g, '\n');

        try {
            const originalMessage = await interaction.channel.messages.fetch(oldid);

            if (!originalMessage) {
                return interaction.member.send("Error: Original message not found.");
            }

            const username = originalMessage.member ? (originalMessage.member.nickname || originalMessage.author.username) : originalMessage.author.username;

            // Create a webhook
            const webhook = await interaction.channel.createWebhook({
                name: 'thecrusader',
                avatar: interaction.client.user.displayAvatarURL(),
            });

            // Send the corrected message using the webhook
            const webhookMessage = await webhook.send({
                content: correctedMessage,
                username: username,
                avatarURL: originalMessage.author.displayAvatarURL(),
            });

            // Construct the message link
            const messageLink = `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${webhookMessage.id}`;

            // Delete the webhook after use to clean up
            await webhook.delete();

            // Log the correction in the guild's log channel if needed
            const guildId = interaction.guild.id;
            const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);

            try {
                await fs.promises.access(filePath, fs.constants.F_OK);
                let currInfo = require(filePath);
                const logID = currInfo.logID;
                const logChannel = await interaction.client.channels.fetch(logID);
                logChannel.send(">>> " + "<@" + interaction.member.id + "> corrected message from user <@" + originalMessage.member.id + ">." + "\n Original message content: \"" + originalMessage.content + "\"" + "\n New message: " + messageLink);            
            } catch (err) {
                // Handle error, file doesn't exist
                interaction.channel.send(">>> " + "<@" + interaction.member.id + "> corrected message from user <@" + originalMessage.member.id + ">." + "\n Original message content: \"" + originalMessage.content + "\"")
                interaction.channel.send("Please register this server and/or register the log channel with the /setLogChannel command.")
                console.error("Log file not found or log channel not set.");
            }

            // Delete the original message
            await originalMessage.delete();


        } catch (error) {
            console.error("Failed to delete the original message or send the corrected message:", error);
            await interaction.member.send("An error occurred while trying to correct the message");
        }

    },
};
