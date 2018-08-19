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

	async run(msg) {
		setTimeout(() => {
            process.send({
                type: 'managerrestart',
                channel: msg.channel.id,
            });
        }, 500);
		return msg.say('Restarting...');
	}
};

