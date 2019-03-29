const commando = require('discord.js-commando');

module.exports = class CrAddCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'cradd',
			group: 'cr',
			memberName: 'cradd',
			description: 'Add a custom reaction',
			args: [
				{
					key: 'trigger',
					prompt: 'What should the trigger be?',
					type: 'string',
				},
				{
					key: 'response',
					prompt: 'What should the response be?',
					type: 'string',
				},
			],
		});
	}

	async run(msg, {trigger, response}) {
		this.client.models.cr.create(msg.guild.id, trigger, response).then((result) => {
			return msg.say('Sure, I\'ll say ' + response + ' in response to ' + trigger + '.');
		}).catch((e) => {
			return msg.say('noooo' +  e);
		});
	}
};
