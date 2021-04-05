const commando = require('discord.js-commando');

module.exports = class CrashCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'crash',
			group: 'owner',
			memberName: 'crash',
			description: 'crash',
		});
	}

	async hasPermission(msg) {
		return (this.client.isOwner(msg.author));
	}

	async run(msg) {
		msg.say('crashing...');
		msg.say(haha(crash));
		return;
	}
};
