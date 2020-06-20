const commando = require('discord.js-commando');
const config = require('../../config.json');

module.exports = class SupportCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'support',
			group: 'info',
			memberName: 'support',
			description: 'Get the support server invite in a DM',
		});
	}

	async run(msg) {
        msg.author.createDM().then(dmChannel => {
            return dmChannel.send(`Join aeiou's support server here: ${config.discord.support}`);
        }).then(() => {
            msg.say('I\'ve sent you a DM with the support server invite!');
        }).catch(() => {
            msg.say('I couldn\'t DM you the server invite. Please check if you allow DMs from this server and that you haven\'t blocked me.');
        })
		return null;
	}
};
