const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user for a specific amount of time')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option =>
            option.setName('user')
                .setDescription('The @ of a user you want to timeout')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('time')
                .setDescription('The amount of minutes to timeout')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the timeout')
                .setRequired(true)),
    async execute(interaction) {
        try {
            let userId = interaction.options.getString('user');
            let time = interaction.options.getInteger('time');
            let reason = interaction.options.getString('reason')
            time = time * 1000 * 60

            const guildId = interaction.guild.id;
            const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);
            let serverInfo = require(filePath); 


            //Extract the user ID from the mention format
            userId = userId.replace(/[<@!>]/g, '');

            //Fetch the member using the user ID
            const trueUser = await interaction.guild.members.fetch(userId);

            if (!trueUser) {
                return interaction.reply('User not found in this guild.', { ephemeral: true });
            }

            //Use the guild member timeout method
            trueUser.timeout(time, reason)
                .then(() => {
                    console.log('Timed user out.');
                    interaction.guild.channels.fetch(serverInfo.logID).then(channel => {
                        channel.send(">>> " + "Timed out user <@" + trueUser.id + "> for " + time + " minutes due to " + reason)
                    })
                })
                .catch(console.error);
            interaction.reply("Timeout successful")

        } catch (error) {
            await interaction.member.send('An error occurred while trying to timeout the user.', { ephemeral: true });
            console.log(error);
        }
    },
};
