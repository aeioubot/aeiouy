const commando = require('discord.js-commando');

module.exports = class CrDelCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'crdel',
			group: 'cr',
			memberName: 'crdel',
			description: 'Delete a custom reaction',
			args: [
				{
					key: 'trigger',
					prompt: 'What\'s the trigger of the reaction?',
					type: 'string',
				},
				{
					key: 'response',
					prompt: 'Which response do you want to delete?',
                    type: 'string',
                    default: false
				},
			],
		});
	}

	async run(msg, {trigger, response}) {
		this.client.models.cr.find(msg.guild.id, trigger, response).then((result) => {
            if (result.length === 0) return msg.say('I couldn\'t find that custom reaction');
            if (result.length === 1) {
                this.client.models.cr.deleteByTrigger(msg.guild.id, trigger, response);
                return msg.say('I\'ve deleted it.')
            }
            result = result.map(cr => cr.dataValues);
            if (response === false) {
                result = result.map((cr, index) => {
                    return `${index + 1}. ${cr.trigger}
        => ${cr.response}`
                });
                return msg.say('Multiple reactions found. Please specify the response as well. ```\n' + result.join('\n') + '```')
            }
            this.client.models.cr.deleteById(result[0].id);
            return msg.say('There were multiple reactions with this trigger & response; I\'ve deleted one of them.');
		}).catch((e) => {
			return msg.say('noooo' +  e);
		});
	}
};
