const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config.json');

const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, './commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        let clear = process.argv.includes('--clear');
        if (process.argv.includes('--global')) {
            console.log('Refreshing global commands' + (clear ? ' (clearing)' : ''));
            await rest.put(
                Routes.applicationCommands(clientId, guildId),
                { body: clear ? [] : commands },
            );
        }
        else if (process.argv.includes('--guild')) {
            console.log('Refreshing guild commands' + (clear ? ' (clearing)' : ''));
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: clear ? [] : commands },
            );
        }
        
        console.log('Done');
    } catch (error) {
        console.error(error);
    }
})();
