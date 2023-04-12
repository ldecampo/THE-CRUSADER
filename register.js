const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
let secrets = require('./secrets.json');
const commands = [
  {
    name: 'safe',
    description: 'Turns safemode on or off',
    option: 'onOff',
  },
];

const rest = new REST({ version: '9' }).setToken(secrets.token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(secrets.appid), {
      body: commands,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();