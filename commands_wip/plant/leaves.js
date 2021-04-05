// This command is deprecated ... probably.

const commando = require('discord.js-commando');

module.exports = class LeavesCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'leaves',
			group: 'plant',
			memberName: 'leaves',
			description: 'check your leaves',
			args: [
				{
					key: 'user',
					prompt: 'Which user?',
					type: 'user',
					default: false,
				},
			],
		});
	}

	async run(msg, { user }) {
		if (!user) user = msg.author;
		// TODO: new models
		this.client.models.user.find(user.id).then((result) => {
			if (!result) {
				return user.id === msg.author.id ?
					msg.say('You don\'t have any leaves')
					: msg.say('This user doesn\'t have any leaves');
			}
			return user.id === msg.author.id ?
				msg.say('You have :leaves: ' + result.dataValues.leaves)
				: msg.say('This user has :leaves: ' + result.dataValues.leaves);
		}).catch(e => msg.say('noooo' + e));
	}
};
