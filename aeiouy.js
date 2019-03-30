const Commando = require('discord.js-commando');
const path = require('path');
const fs = require('fs');
const config = require('./config.json');
const Database = require('./database.js');
const Gateway = require('./utils/gateway/Gateway.js');
const crlistener = require('./crlistener.js');

Database.start();

const token = config.discord.token;

const Aeiouy = new Commando.CommandoClient({
	owner: config.discord.owners,
	commandPrefix: '!',
	unknownCommandResponse: false,
});

Aeiouy.registry
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

Aeiouy.models = {};
fs.readdir(path.join(__dirname, 'models'), (err, files) => {
	if (err) return console.error(err);
	files.forEach((filename) => {
		Aeiouy.models[filename.slice(0, -3)] = require(path.join(__dirname, 'models', filename));
	});
});

Aeiouy.gateway = new Gateway(Aeiouy);

Aeiouy.on('ready', () => {
	console.log('Ready to go!');
	Aeiouy.on('message', crlistener);
});

process.on('message', (m) => {
	if (m.gateway) {
		Aeiouy.gateway.runCommand(m);
	} else if (typeof m === 'object' && m.type && m.type === 'shardrestart') {
		Aeiouy.channels.get(m.channel).send('Restarted this shard!');
	}
});

Aeiouy.on('error', (e) => {
	if (e.message === 'read ECONNRESET') {
		return console.error('{red}Connection error (ECONNRESET)');
	}
	return console.error(e);
});

Aeiouy.login(token);

require('./console.js')('shard ' + Aeiouy.shard.id);
