const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('completelistentry')
		.setDescription('Cross something off your list')
		.addIntegerOption(option =>
			option.setName('id')
                .setDescription('The ID of the list')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('entrynumber')
                .setDescription('The number of the entry to complete (see /catlist)')
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

        const entrynum = interaction.options.getInteger('entrynumber');
        console.log(entrynum)

        try {

            // Check if entry is valid
            if (entrynum === null) {
                return interaction.reply("Invalid entrynum");
            }
            const listPath = path.resolve(__dirname, `../../lists/${id}_${interaction.member.id}.json`);

            // Read JSON file
            const listItems = require(listPath);

            listItems.items[entrynum] = "~~" + listItems.items[entrynum] + "~~";
            console.log(listItems.items[entrynum]);

            // Write JSON data back to file
            fs.writeFileSync(listPath, JSON.stringify(listItems, null, 2)); // Pretty print JSON

            // Reply to interaction
            interaction.reply(`Entry ${entrynum} completed from **${id}**!`);
        } catch (Exception) {
            interaction.reply("Error completing entry.")
            console.log(Exception)
        }
    },
};