const commando = require('discord.js-commando');
const config = require('../../config.json');

module.exports = class InviteCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'invite',
			group: 'info',
			memberName: 'invite',
			description: 'Get aeiou\'s invite link!',
		});
	}

	async run(msg) {
        return msg.say('Click this link to add aeiou to your server! ' + config.discord.invite);
	}
};