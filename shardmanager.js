const Discord = require('discord.js');
const fs = require('fs');
const config = require('js-yaml').load(fs.readFileSync('./config.yaml'));

require('./console.js')('manager');

const shardingManager = new Discord.ShardingManager('./aeiouy.js', {
	totalShards: config.discord.shards,
	respawn: true,
	token: config.discord.token,
});

const restarts = {};

shardingManager.on('shardCreate', (shard) => {
	console.log(`Created shard {cyan}#${shard.id}{r}!`);
	shard.on('ready', () => {
		console.log(`Shard {cyan}#${shard.id}{r} is ready!`);
	});
	shard.on('death', (p) => {
		if (p.exitCode === 55) {
			console.warn(`Shard {cyan}#${shard.id}{r} is restarting...`);
			shard.once('ready', (process) => {
				console.log('ready again! sending');
				shard.send(restarts[shard.id]);
			});
		} else {
			console.warn(`Shard {cyan}#${shard.id}{r} died! Restarting...`);
		}
	});
	shard.on('message', (m) => {
		if (m.type && m.type === 'shardrestart') {
			console.log(m);
			restarts[shard.id] = {name: 'sendMessage', payload: {channel: m.channel, message: 'I\'m back!'}};
		}
		if (m.gateway) {
			handleGatewayMessage(m);
		} else {
			process.send(m);
		}
	});
});

process.on('message', (m) => {
	if (m.gateway) handleGatewayMessage(m);
});

function handleGatewayMessage(m) {
	// After a shard manager restart, not all shards may be created yet
	if (shardingManager.shards.size < config.discord.shards) {
		shardingManager.once('shardCreate', () => {
			handleGatewayMessage(m);
		});
		return;
	}
	// console.log(`Sending gateway msg of type ${m.name} to max ${shardingManager.shards.size} shards`)
	shardingManager.shards.forEach((found) => {
		if (m.targets.includes(found.id) || m.targets === 'all' || (typeof m.targets === 'object' && m.targets.length === 0)) {
			if (!found.ready) {
				found.once('ready', () => found.send(m));
			} else {
				found.send(m);
			}
		}
	});
}

shardingManager.spawn(shardingManager.totalShards, 0).catch((e) => {
	console.log(e);
});

async function killAll() {
	try {
		shardingManager.shards.forEach(shard => {
			shard.kill();
		});
	}
	catch(e) {
		console.error(e);
	}

	process.exit(1);
}

process.on('SIGINT', killAll);
process.on('SIGABRT', killAll);
