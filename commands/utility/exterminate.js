const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exterminate')
        .setDescription('EXTERMINATE')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option =>
            option.setName('user')
                .setDescription('THE @ OF THE ENTITY YOU WISH TO EXTERMINATE')
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            // First, defer the reply since this will take some time
            await interaction.deferReply();

            // Get the user mention string and extract the ID
            let userId = interaction.options.getString('user');
            userId = userId.replace(/[<@!>]/g, '');

            // Fetch the member using the extracted ID
            const targetMember = await interaction.guild.members.fetch(userId);

            if (!targetMember) {
                return interaction.editReply('User not found in this guild.');
            }

            // Send initial messages
            await interaction.editReply("**EXTERMINATE**");
            
            // Send messages in sequence
            const messages = [];
            messages.push(await interaction.channel.send({ content: `<:blast:1318062902246113322>` }));
            
            // Generate beam
            const beamLength = Math.floor(Math.random() * 6) + 4;
            for (let i = 0; i < beamLength; i++) {
                messages.push(await interaction.channel.send({ content: `<:beam:1318062877445328946>` }));
            }

            // Get the display name
            const displayName = targetMember.nickname || targetMember.user.username;

            // Create and use webhook
            const webhook = await interaction.channel.createWebhook({
                name: 'thecrusader',
                avatar: interaction.client.user.displayAvatarURL(),
            });

            // Wait a short moment before sending the skull message
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Send the skull message
            await webhook.send({
                content: ":skull:",
                username: displayName,
                avatarURL: targetMember.user.displayAvatarURL(),
            });

            // Delete the webhook
            await webhook.delete();


            
            interaction.channel.permissionOverwrites.create(targetMember, { ViewChannel: false });

            // Remove role after 15 minutes
            setTimeout(async () => {
                try {
                    await interaction.channel.permissionOverwrites.create(targetMember, { ViewChannel: true });;
                } catch (error) {
                    console.error('Failed re-add permissions:', error);
                }
            }, 15 * 60 * 1000);

        } catch (error) {
            console.error('FAILED TO EXTERMINATE:', error);
            await interaction.followUp({ content: 'FAILED TO EXTERMINATE.', ephemeral: true });
        }
    },
};