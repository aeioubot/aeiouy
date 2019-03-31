const commando = require('discord.js-commando');
const GatewayCommand = require('../../utils/gateway/GatewayCommand');

module.exports = class ShardsCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'shards',
			group: 'info',
			memberName: 'shards',
			description: 'View shards info.',
			aliases: ['shard', 'sh'],
		});
	}

	async run(msg) {
		this.client.gateway.sendCommand(new GatewayCommand({
			client: this.client,
			name: 'shardinfo',
			payload: {},
			targets: [],
		})).then((data) => {
			data = data.sort((a, b) => a.source - b.source);
			const s = '     ';
			let response = '```md\n# Shard' + s + 'Guilds' + s + 'Channels' + s + 'Members';
			const totals = {
				guilds: 0,
				channels: 0,
				members: 0,
			};
			for (const i in data) {
				totals.guilds += data[i].payload.guilds;
				totals.channels += data[i].payload.channels;
				totals.members += data[i].payload.members;
				let toAdd = (data[i].source === this.client.shard.id ? '\n# ' : '\n  ');
				toAdd += data[i].source.toString().padStart(5, ' ') + s + data[i].payload.guilds.toString().padStart(6, ' ') + s + data[i].payload.channels.toString().padStart(8, ' ') + s + data[i].payload.members.toString().padStart(7, ' ');
				response += toAdd;
			}
			response += '\n# Total' + s + totals.guilds.toString().padStart(6, ' ') + s + totals.channels.toString().padStart(8, ' ') + s + totals.members.toString().padStart(7, ' ');
			msg.say(response + '```');
		});
	}
};
