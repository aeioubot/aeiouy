const commando = require('discord.js-commando');

module.exports = class DogCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'dog',
			group: 'mod',
			memberName: 'dog',
			description: 'Checks the bot\'s dog to the Discord server, relative to yours.',
			aliases: ['woof'],
		});
	}

	async run(msg) {
		// console.log('{red}Woof Dog Dog');
		return msg.say('woof woof');
	}
};
