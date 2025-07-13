const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');
const { EmbedBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('catlist')
		.setDescription('View your list')
		.addIntegerOption(option =>
			option.setName('id')
                .setDescription('The ID of the list')
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

        try {
            const listPath = path.resolve(__dirname, `../../lists/${id}_${interaction.member.id}.json`);

            // Read JSON file
            const listItems = JSON.parse(fs.readFileSync(listPath, 'utf8')); // Use fs.readFileSync instead of require
            let endingString = "";
            
            if (!listItems.items || listItems.items.length === 0) {
                endingString = "No entries yet";
            } else {
                for (let i = 0; i < listItems.items.length; i++) {
                    endingString += `\`${i}.\` ${listItems.items[i]}\n`;
                }
            }
            
            const owner = await interaction.guild.members.fetch(master.listInfo[id].owner);
            const embed = new EmbedBuilder()
                .setColor('8C6E0F')
                .setTitle(master.listInfo[id].name)
                .setDescription(`By ${owner.displayName}`)
                .addFields({ name: 'Entries:', value: endingString });
            
            await interaction.reply({ embeds: [embed] });
        } catch (Exception) {
            interaction.reply("Error catting list")
            console.log(Exception)
        }
    },
};