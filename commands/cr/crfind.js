const commando = require('discord.js-commando');

module.exports = class CrFind extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'crfind',
			group: 'cr',
			memberName: 'crfind',
			description: 'Find custom reactions',
			args: [
				{
					key: 'query',
					prompt: 'What do you want to search for?',
					type: 'string',
				},
			],
		});
	}

	async run(msg, { query }) {
		this.client.mods.reaction.findAll({where: {guild: msg.guild.id}}).then((result) => {
			result = result.map(cr => cr);
			result = result.filter(cr => cr.trigger.includes(query) || cr.response.includes(query));
			result = result.map((cr, index) => `${index + 1}. ${cr.trigger}
    => ${cr.response}`);
			if (result.length > 0) return msg.say('Here are the search results:' + '```\n' + result.join('\n') + '```');
			return msg.say('No custom reactions found.');
		}).catch(e => msg.say('noooo' + e));
	}
};
