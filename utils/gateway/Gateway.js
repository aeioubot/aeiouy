const GatewayCommand = require('./GatewayCommand.js');
const fs = require('fs');
const path = require('path');

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
		if (!(command instanceof GatewayCommand)) return 'Command must be a GatewayCommand.';
		command.source = this.client.shard.id;
		return new Promise((resolve, reject) => {
			this.pending[command.time] = {
				responses: [],
				resolve,
				reject,
				totalTargets: command.targets === 'all' ? this.client.shard.count : command.targets.length,
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
		return this.commands[command.name](this.client, command.payload).then((output) => {
			process.send(new GatewayCommand({
				name: 'response',
				payload: output,
				targets: [command.source],
				source: this.client.shard.id,
				time: command.time,
			}));
		}).catch((e) => {
			process.send(new GatewayCommand({
				name: 'response',
				payload: null,
				targets: [command.source],
				source: this.client.shard.id,
				time: command.time,
			}));
		});
	}
}

module.exports = Gateway;
