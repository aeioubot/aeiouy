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
		if (typeof m === 'object' && m.type === 'managerrestart') {
			console.warn('Restarting all shards!');
			child.kill();
			run(m);
		}
	});
};
run();
