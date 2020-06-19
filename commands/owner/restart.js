const commando = require('discord.js-commando');
const fs = require('fs');

module.exports = class RestartCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'restart',
			group: 'owner',
			memberName: 'restart',
			description: 'Restart this shard.',
			aliases: ['re'],
		});
	}

	hasPermission(msg) {
		return (this.client.isOwner(msg.author));
	}

	async run(msg) {
		process.send({
			type: 'shardrestart',
			channel: msg.channel.id,
		});
		console.warn(`Restarting shard {cyan}#${this.client.shard.ids}{r}...`);
		setTimeout(() => {
			process.exit(55);
		}, 500);
		return msg.say('Restarting shard...');
	}
};
