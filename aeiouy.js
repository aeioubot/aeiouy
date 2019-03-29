const Commando = require('discord.js-commando');
const path = require('path');
const config = require('./config.json');
const fs = require('fs');
const Database = require('./database.js');
const Gateway = require('./Gateway.js')
const crlistener = require('./crlistener.js')
Database.start();

const token = config.discord.token;

const client = new Commando.CommandoClient({
	owner: config.discord.owners,
	commandPrefix: '!',
	unknownCommandResponse: false,
});

client.registry
	.registerGroups([
		['mod', 'Commands for moderation'],
		['cr', 'Custom reactions'],
		['owner', 'Owner commands'],
		['info', 'info commands'],
		['fun', 'fun commands'],
		['music', 'mmmmmm commands'],
		['plant', 'plant commands'],
	])
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.models = {};
fs.readdir(path.join(__dirname, 'models'), (err, files) => {
	if (err) return console.error(err);
	files.forEach((filename) => {
		client.models[filename.slice(0, -3)] = require(path.join(__dirname, 'models', filename));
	});
});

client.utils = {};
fs.readdir(path.join(__dirname, 'utils'), (err, files) => {
	if (err) return console.error(err);
	files.forEach((filename) => {
		client.utils[filename.slice(0, -3)] = require(path.join(__dirname, 'utils', filename));
	});
});

client.gateway = new Gateway(client);

client.on('ready', () => {
	client.on('message', crlistener)
	// console.log('{green}I am alive!');
});

process.on('message', (m) => {
	if (m.gateway) {
		client.gateway.runCommand(m);
	}
	else if (typeof m === 'object' && m.type && m.type === 'shardrestart') {
		client.channels.get(m.channel).send('Restarted this shard!');
	}
});

client.on('error', (e) => {
	if (e.message === 'read ECONNRESET') {
		return console.error('{red}Connection error (ECONNRESET)');
	}
	console.error(e);
});

client.login(token);

require('./console.js')('shard ' + client.shard.id);