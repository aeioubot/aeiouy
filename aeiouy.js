const Commando = require('discord.js-commando');
const { Permissions } = require('discord.js');
const path = require('path');
const fs = require('fs');
const Database = require('./database.js');
const Gateway = require('./utils/gateway/Gateway.js');
const ReactionListener = require('./crlistener.js');

const config = require('js-yaml').load(fs.readFileSync('./config.yaml'));

Database.start();

const token = config.discord.token;

const Aeiouy = new Commando.CommandoClient({
	owner: config.discord.owners,
	commandPrefix: config.discord.prefix,
	invite: config.discord.support,
	unknownCommandResponse: false,
});

Aeiouy.config = config;

(require('./models_new')()).then(models => {
	Aeiouy.mods = models;
	let reactionListener = new ReactionListener(models.reaction);
	Aeiouy.on('message', (msg) => { reactionListener.check(msg); });
})

// Aeiouy.models = require('require-all')({
// 	dirname: __dirname + '/models',
// 	recursive: true
// });

Aeiouy.utils = require('require-all')({
	dirname: __dirname + '/utils',
	excludeDirs: /^(gateway)$/,
	recursive: true
});

Aeiouy.registry
	.registerGroups([
		['mod', 'Commands for moderation'],
		['cr', 'Custom reactions'],
		['owner', 'Developer commands'],
		['info', 'info commands'],
		['fun', 'fun commands'],
		['plant', 'Plant game'],
		['util', 'u t i l i t y'],
	])
	.registerDefaultTypes()
	.registerDefaultGroups()
	.registerDefaultCommands({
		unknownCommand: false,
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));


Aeiouy.gateway = new Gateway(Aeiouy);

Aeiouy.on('ready', () => {
	console.log('Ready to go!');
});

Aeiouy.once('ready', () => {
	const permissions = new Permissions(Permissions.DEFAULT);
	permissions.remove('MENTION_EVERYONE');
	permissions.add(config.discord.invite_permissions);
	Aeiouy.botInvite = `<https://discord.com/oauth2/authorize?client_id=${Aeiouy.user.id}&permissions=${permissions.bitfield}&scope=bot>`;
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
require('./console.js')('shard ' + Aeiouy.shard.ids);
