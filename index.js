const {fork} = require('child_process');
const GatewayCommand = require('./utils/gateway/GatewayCommand');


const run = (restart) => {
	const child = fork('./shardmanager.js', [], {});

	if (restart) {
		child.send(new GatewayCommand({
			name: 'sendMessage',
			payload: {
				channel: restart.channel,
				message: 'Restarted all shards!',
			},
			targets: 'all',
		}));
	}

	child.on('message', (m) => {
		if (typeof m === 'object' && m.type) {
			switch (m.type) {
			case 'managerrestart':
				console.warn('Restarting all shards!');
				child.kill();
				run(m);
				break;
			case 'managerkill':
				console.fatal('Goodbye...');
				child.kill();
				process.exit(0);
				break;
			}
		}
	});
};
run();

// require('./console.js')(' index '); // Sets up console.log stuff
// const config = require('./config.json');
// const { ShardingManager } = require('discord.js');
// const manager = new ShardingManager('./aeiouy.js', {totalShards: config.discord.shards, respawn: true, mode: 'process'});

// manager.on('shardCreate', shard => {
// 	shard.on('message', msg => {
// 		if (!msg.targets || msg.targets.length == 0) {
// 			return manager.shards.map((shard, index) => shard.send(msg).catch(e => console.error(`Shard ${index} is experiencing issues, and failed to recieve a gateway message. Error: ${e}`)));
// 		}

// 		return msg.targets.map((id, index) => {
// 			manager.shards.get(id).send(msg).catch(e => console.error(`Shard ${index} is experiencing issues, and failed to recieve a gateway message. Error: ${e}`));
// 		});
// 	});
// });

// manager.spawn(manager.totalShards, 100);
