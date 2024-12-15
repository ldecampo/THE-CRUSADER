const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createlist')
		.setDescription('Creates a new list that can be used for listing things (you know what a list is)')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of your list.')
				.setRequired(true)),
	async execute(interaction) {
        const name = interaction.options.getString('name');
        console.log(name)

        try {

            // Check if name is valid
            if (!name) {
                return interaction.reply("Invalid name");
            }

            const masterPath = path.resolve(__dirname, `../../lists/master.json`);
            let master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
            if (!Array.isArray(master.listInfo)) {
                master.listInfo = [];
            }
            const listID = master.listInfo.length;

            const listInfoInstance = {
                id: listID, 
                name: name, 
                owner: interaction.member.id,
                isLooping: false,
                loopingGuild : 0,
                loopingChannel : 0
            };
            const listPath = path.resolve(__dirname, `../../lists/${listID}_${interaction.member.id}.json`);



            // Read JSON file
            master.listInfo.push(listInfoInstance);

            // Write JSON data back to file
            fs.writeFileSync(masterPath, JSON.stringify(master, null, 2)); // Pretty print JSON


            fs.access(listPath, fs.constants.F_OK, (err) => {
            var emptyItems = [];
            var jsonArray = { 
                "items"  :  emptyItems
            }

            require("fs").writeFileSync(listPath, JSON.stringify(jsonArray));
            // Reply to interaction
            interaction.reply(`List ${name} created with ID **${listID}**!`);
            });
        } catch (Exception) {
            interaction.reply("Error creating list")
            console.log(Exception)
        }
    },
};