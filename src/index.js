// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('../config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, './commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

const db = require('./database');
client.database = db;

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
	require('./database.js');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

const responder = require('./events/responder');
client.on('messageCreate', responder);

const legacyCommandResponder = require('./events/legacy-command-responder');
client.on('messageCreate', legacyCommandResponder);

// Login to Discord with your client's token
client.login(token);
