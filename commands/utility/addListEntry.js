const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addlistentry')
		.setDescription('Add something to your list')
		.addIntegerOption(option =>
			option.setName('id')
                .setDescription('The ID of the list')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('entry')
                .setDescription('The thing to add')
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

        const entry = interaction.options.getString('entry');
        console.log(entry)

        try {

            // Check if entry is valid
            if (!entry) {
                return interaction.reply("Invalid entry");
            }
            const listPath = path.resolve(__dirname, `../../lists/${id}_${interaction.member.id}.json`);

            // Read JSON file
            const listItems = require(listPath);

            listItems.items.push(entry);

            // Write JSON data back to file
            fs.writeFileSync(listPath, JSON.stringify(listItems, null, 2)); // Pretty print JSON

            // Reply to interaction
            interaction.reply(`Entry added to **${id}**!`);
        } catch (Exception) {
            interaction.reply("Error creating list")
            console.log(Exception)
        }
    },
};