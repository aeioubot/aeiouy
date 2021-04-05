const commando = require('discord.js-commando');

module.exports = class PouchCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'plant',
			group: 'plant',
			memberName: 'plant',
			description: 'Plants is currently not available due to some work-in-progress upgrades, apologies for the inconvenience.',
			aliases: ['seed', 'seeds', 'pouch', 'status', 'leaves', 'plants'],
		});
	}

	async run(msg) {
		return msg.say('Plants is currently not available due to some work-in-progress upgrades, apologies for the inconvenience.')
	}
};
