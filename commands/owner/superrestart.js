const commando = require('discord.js-commando');
const fs = require('fs');

module.exports = class SuperRestartCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'superrestart',
			group: 'owner',
			memberName: 'superrestart',
			description: 'Restart all shards',
			aliases: ['sr'],
		});
	}

	hasPermission(msg) {
		return (this.client.isOwner(msg.author));
	}

	async run(msg) {
		return msg.say('Restarting...').then(() => {
			process.send({
				type: 'managerrestart',
				channel: msg.channel.id,
			});
		});
	}
};

