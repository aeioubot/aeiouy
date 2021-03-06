const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

require('./console.js')('manager');

const shardingManager = new Discord.ShardingManager('./aeiouy.js', {
	totalShards: config.discord.shards,
	respawn: true,
	token: config.discord.token,
});

const restarts = {};

shardingManager.on('launch', (shard) => {
	console.log(`Created shard {cyan}#${shard.id}{r}!`);
	shard.on('ready', () => {
		console.log(`Shard {cyan}#${shard.id}{r} is ready!`);
	});
	shard.on('death', (p) => {
		if (p.exitCode === 55) {
			console.warn(`Shard {cyan}#${shard.id}{r} is restarting...`);
			const onLaunch = (s2) => {
				const onReady = () => {
					s2.send(restarts[shard.id]);
					s2.off('ready', onReady);
				};
				s2.on('ready', onReady);
				shardingManager.off('launch', onLaunch);
			};
			shardingManager.on('launch', onLaunch);
		} else {
			console.warn(`Shard {cyan}#${shard.id}{r} died! Restarting...`);
		}
	});
	shard.on('message', (m) => {
		//console.log('SHARD:MESSAGE', m);
		if (m.type && m.type === 'shardrestart') {
			restarts[shard.id] = {name: m.type, payload: {channel: m.channel}};
		}
		if (m.gateway) {
			handleGatewayMessage(m);
		} else {
			process.send(m);
		}
	});
});

process.on('message', (m) => {
	//console.log('PROCESS:MESSAGE', m);
	if (m.gateway) handleGatewayMessage(m);
});

function handleGatewayMessage(m) {
	shardingManager.shards.forEach((found) => {
		if (m.targets.includes(found.id) || m.targets === 'all' || (typeof m.targets === 'object' && m.targets.length === 0)) {
			if (!found.ready) {
				const sendTheCommandThatIsPending = () => {
					found.send(m);
					found.off('ready', sendTheCommandThatIsPending);
				};
				found.on('ready', sendTheCommandThatIsPending);
			} else {
				found.send(m);
			}
		}
	});
}

shardingManager.spawn(shardingManager.totalShards, 500).catch((e) => {
	console.log(e);
});
