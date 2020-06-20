const commando = require('discord.js-commando');

module.exports = class CrList extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'crlist',
			group: 'cr',
			memberName: 'crlist',
			description: 'List all custom reactions',
			args: [
				{
					key: 'page',
					prompt: 'Page number?',
					type: 'integer',
					default: 1,
				},
				{
					key: 'sort',
					prompt: 'Sort by trigger/reaction/date?',
					type: 'string',
					oneOf: ['trigger', 'reaction', 'date'],
					default: 'date',
				},
				{
					key: 'order',
					prompt: 'Ascending or descending?',
					type: 'string',
					parse: (val) => {
						if (val.indexOf('desc') == 0) return -1;
						return 1;
					},
					default: 'asc',
				},
			],
			// TODO - tips: ['You can list CRs ordered by trigger/reaction/date (see: !help crlist)']
		});
	}

	async run(msg, { page, sort, order }) {
		page--;
		this.client.mods.reaction.findAll({where: {guild: msg.guild.id}}).then((result) => {
			result = result.map(cr => cr);
			switch (sort) {
			case 'trigger':
				result = result.sort((a, b) => {
					if (a.trigger > b.trigger) return 1 * order;
					return -1 * order;
				});
				break;
			case 'reaction':
				result = result.sort((a, b) => {
					if (a.reaction > b.reaction) return 1 * order;
					return -1 * order;
				});
				break;
			case 'date':
				result = result.sort((a, b) =>
					// console.log(a.createdAt + ' -> ' + Date.parse(a.createdAt));
					// console.log(Date.parse(a.createdAt) - Date.parse(b.createdAt))
					Date.parse(a.createdAt) - Date.parse(b.createdAt));
				break;
			}
			const totalPages = Math.ceil(result.length / 10);
			result = result.slice(page * 10, (page + 1) * 10);
			if (result.length === 0) return msg.say('No custom reactions found on this page');
			result = result.map((cr, index) => `${page * 10 + index + 1}. ${cr.trigger.length > 70 ? cr.trigger.substr(0, 70) + '...' : cr.trigger}
    => ${cr.response.length > 70 ? cr.response.substr(0, 70) + '...' : cr.response}`);
			// console.log(this);
			// if (Math.random() < 1) toSay = this.tips[Math.floor(Math.random() * this.tips.length)] + '\n' + toSay;
			const toSay = `Showing page ${page + 1} of ${totalPages}.\`\`\`\n${result.join('\n')}\`\`\``;
			return msg.say(toSay);
		}).catch(e => msg.say('sorry something went wrong: ' + e));
	}
};
