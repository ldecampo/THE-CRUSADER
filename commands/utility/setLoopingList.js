const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setloopinglist')
		.setDescription('Set your list to loop at the current channel.')
		.addIntegerOption(option =>
			option.setName('id')
                .setDescription('The ID of the list')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('loop')
                .setDescription('To loop or not to loop')
                .setRequired(true)),
	async execute(interaction) {
        const masterPath = path.resolve(__dirname, `../../lists/master.json`);
        let master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

        const id = interaction.options.getInteger('id');
        if (id != master.listInfo[id].id) {
            console.log(id);
            console.log(master.listInfo[id].id);
            return interaction.reply("Critical error - contact developer @kenorbs immediately.");
        }

        if (interaction.member.id != master.listInfo[id].owner) {
            return interaction.reply("You do not own list " + id + "!");
        }

        const guildId = interaction.guild.id;
        const filePath = path.resolve(__dirname, `../../guilds/${guildId}.json`);
        const info = require(filePath);
        console.log(info);

        if(!(info.allowLoopedLists)) {
            console.log(info.allowLoopedLists);
            return interaction.reply("Server does not allow looped lists - contact an admin if you think this is a mistake.")
        }

        const entry = interaction.options.getBoolean('loop');
        console.log(entry)

        try {

            // Check if entry is valid
            if (entry === null) {
                return interaction.reply("Invalid entry");
            }
            
            master.listInfo[id].isLooping = entry;
            master.listInfo[id].loopingGuild = interaction.guild.id;
            master.listInfo[id].loopingChannel = interaction.channel.id;

            // Write JSON data back to file
            fs.writeFileSync(masterPath, JSON.stringify(master, null, 2)); // Pretty print JSON

            // Reply to interaction
            interaction.reply(`Set list **${id}**'s looping ability to ${entry}!`);
        } catch (Exception) {
            interaction.reply("Error creating list")
            console.log(Exception)
        }
    },
};