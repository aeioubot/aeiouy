require('./console.js')(' index ');

const { fork } = require('child_process');
const GatewayCommand = require('./GatewayCommand.js');

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
