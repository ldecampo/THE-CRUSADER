const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sudo')
        .setDescription('Sudo a user')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option =>
            option.setName('user')
                .setDescription('The @ of a user you want to sudo')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message you wish to send')
                .setRequired(true)),
    async execute(interaction) {
        try {
            let userId = interaction.options.getString('user');
            let message = interaction.options.getString('message');

            // Replace any placeholder newline characters with actual newlines
            message = message.replace(/\\n/g, '\n');

            //Extract the user ID from the mention format
            userId = userId.replace(/[<@!>]/g, '');

            //Fetch the member using the user ID
            const trueUser = await interaction.guild.members.fetch(userId);

            if (!trueUser) {
                return interaction.reply('User not found in this guild.', { ephemeral: true });
            }

            //Determine the display name to use
            const username = trueUser.nickname || trueUser.user.username;

            //Create a webhook
            const webhook = await interaction.channel.createWebhook({
                name: 'thecrusader',
                avatar: interaction.client.user.displayAvatarURL(),
            });

            //Send the message using the webhook
            const webhookMessage = await webhook.send({
                content: message,
                username: username,
                avatarURL: trueUser.user.displayAvatarURL(),
            });

            // Construct the message link
            const messageLink = `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${webhookMessage.id}`;


            //Delete the webhook after use
            await webhook.delete();

            //Log the action in the guild's log channel if needed
            const guildId = interaction.guild.id;
            const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);

            try {
                await fs.promises.access(filePath, fs.constants.F_OK);
                let currInfo = require(filePath);
                const logID = currInfo.logID;
                const logChannel = await interaction.client.channels.fetch(logID);
                logChannel.send(`>>> <@${interaction.member.id}> sent a message as user <@${trueUser.id}>.\n Message: ${messageLink}`);
            } catch (err) {
                // Handle error, file doesn't exist
                interaction.channel.send(`>>> <@${interaction.member.id}> sent a message as user <@${trueUser.id}>.`);
                interaction.channel.send('Please register this server and/or register the log channel with the /setLogChannel command.');
                console.error('Log file not found or log channel not set.');
            }

        } catch (error) {
            console.error('Failed to sudo the message:', error);
            await interaction.member.send('An error occurred while trying to send the message.', { ephemeral: true });
        }
    },
};
