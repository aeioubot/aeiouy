const commando = require('discord.js-commando');

module.exports = class PouchCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'pouch',
			group: 'plant',
			memberName: 'pouch',
			description: 'view seeds',
			aliases: ['seed', 'seeds']
		});
	}

	async run(msg) {
        this.client.models.plant.find(msg.author.id, {planted: false}).then((result) => {
            if (result.length === 0) {
                return msg.say('You don\'t have any seeds!');
            }
            result = result.map(x => x.dataValues);
            result = result.map((seed, index) => {
                return `${index}. ${seed.name}`
            });
            return msg.say('Seeds:\n' + result.join('\n'));
        }).catch((e) => {
			return msg.say('noooo' +  e);
		});
	}
};
