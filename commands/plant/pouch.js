const commando = require('discord.js-commando');

module.exports = class PouchCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'pouch',
			group: 'plant',
			memberName: 'pouch',
			description: 'view seeds',
			aliases: ['seed', 'seeds'],
		});
	}

	async run(msg) {
		this.client.mods.user.findOne({where: {id: msg.author.id}}).then(user => {
			user.getPlants({ where: {planted: false}}).then(plants => {
				if (plants.length === 0) {
					return msg.say('You don\'t have any seeds!');
				}
				plants = plants.map((seed, index) => `${index}. ${seed.name}`);
				return msg.say('Seeds:\n' + plants.join('\n'));
			});
		});
	}
};
