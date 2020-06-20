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
			userPermissions: ['MANAGE_MESSAGES'],
		});
	}


	async run(msg, { trigger, response }) {
		this.client.mods.reaction.create({
			guild: msg.guild.id,
			type: 'whole',
			trigger,
			response,
		}).then(() => {
			msg.say('Sure, I\'ll say ' + response + ' in response to ' + trigger + '.');
		}).catch(e => msg.say('Something went wrong! ' + e));
		//this.client.models.cr.create(msg.guild.id, trigger, response).then(result => msg.say('Sure, I\'ll say ' + response + ' in response to ' + trigger + '.')).catch(e => msg.say('noooo' + e));
	}
};
