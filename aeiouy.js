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
	commandPrefix: config.discord.prefix,
	invite: config.discord.invite,
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
		['util', 'u t i l i t y'],
	])
	.registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands({
		unknownCommand: false,
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));
/*
Aeiouy.models = {};
fs.readdir(path.join(__dirname, 'models'), (err, files) => {
	if (err) return console.error(err);
	files.forEach((filename) => {
		Aeiouy.models[filename.slice(0, -3)] = require(path.join(__dirname, 'models', filename));
	});
});*/

Aeiouy.models = require('require-all')({
	dirname     :  __dirname + '/models',
	recursive   : true
})

Aeiouy.utils = require('require-all')({
	dirname     :  __dirname + '/utils',
	excludeDirs :  /^(gateway)$/,
	recursive   : true
  });

Aeiouy.gateway = new Gateway(Aeiouy);

Aeiouy.on('ready', () => {
	console.log('Ready to go!');
	Aeiouy.on('message', crlistener);
});

process.on('message', (m) => {
	Aeiouy.gateway.runCommand(m);
});

Aeiouy.on('error', (e) => {
	if (e.message === 'read ECONNRESET') {
		return console.error('{red}Connection error (ECONNRESET)');
	}
	return console.error(e);
});

Aeiouy.login(token);

require('./console.js')('shard ' + Aeiouy.shard.id);
