const GatewayCommand = require('./GatewayCommand.js');

class Gateway {
	constructor(client) {
		this.client = client;
		this.pending = {};
		this.commands = {};
		this.commands = require('require-all')({
			dirname: __dirname + '/gatewayCommands',
			filter: n => n.slice(0, -3),
		});
	}

	sendCommand(command) {
		if (!(command instanceof GatewayCommand)) throw new Error('Command must be a GatewayCommand.');
		return new Promise((resolve, reject) => {
			this.pending[command.time] = {
				responses: [],
				resolve,
				reject,
				totalTargets: (!command.targets || command.targets.length == 0) ? this.client.shard.count : command.targets.length,
			};
			process.send(command);
		});
	}

	async runCommand(command) {
		if (command.name === 'response') {
			if (!this.pending[command.time]) return;
			this.pending[command.time].responses.push(command);
			if (this.pending[command.time].responses.length < this.pending[command.time].totalTargets) return;
			this.pending[command.time].resolve(this.pending[command.time].responses.map(({ payload, source }) => ({
				payload,
				source,
			})));
			return delete this.pending[command.time];
		}
		if (!this.commands[command.name]) return;
		return this.commands[command.name](this.client, command.payload).then((output) => {
			process.send(new GatewayCommand({
				client: this.client,
				name: 'response',
				payload: output,
				targets: [command.source],
				time: command.time,
			}));
		}).catch((e) => {
			process.send(new GatewayCommand({
				client: this.client,
				name: 'response',
				payload: null,
				targets: [command.source],
				time: command.time,
			}));
		});
	}
}

module.exports = Gateway;
