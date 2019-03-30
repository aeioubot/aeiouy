const commando = require('discord.js-commando');

module.exports = class PlantCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'plant',
			group: 'plant',
			memberName: 'plant',
			description: 'Plant a seed',
			args: [
				{
					key: 'id',
					prompt: 'Which seed?',
					type: 'integer',
				},
			],
		});
	}

	async run(msg, { id }) { // findseeds
		this.client.models.plant.find(msg.author.id).then((result) => {
			if (result.filter(x => x.dataValues.planted == true).length > 0) {
				return msg.say('you already have a plant! check it out with !status');
			}
			if (!result[id]) return msg.say('Seed not found');
			this.client.models.plant.plant(result[id].dataValues.id);
			return msg.say('seed planted! :sunflower:');
		}).catch(e => msg.say('error: ' + e));
	}
};
