const commando = require('discord.js-commando');

module.exports = class StatusCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'status',
			group: 'plant',
			memberName: 'status',
			description: 'Get your plant status!',
		});
	}

	async run(msg, { trigger, response }) {
		this.client.models.plant.find(msg.author.id, { planted: true }).then((result) => {
			if (!result || result.length === 0) return msg.say('You don\'t have a plant!');
			result = result[0].dataValues;
			result = this.client.utils.growPlant(result);
			let toSay = '';
			toSay += 'Here is your current plant.';
			msg.say(toSay, this.client.utils.generatePlantEmbed(result));
		}).catch(e => msg.say('error: ' + e));
	}
};
