const commando = require('discord.js-commando');
module.exports = class HarvestCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'harvest',
			group: 'plant',
			memberName: 'harvest',
			description: 'harvest your plant',
		});
	}

	async run(msg) {
		this.client.models.plant.find(msg.author.id, {planted: true}).then((result) => {
			if (!result || result.length === 0) return msg.say('You don\'t have a plant!');
            result = result[0].dataValues;
			result = this.client.utils.growPlant(result);
            this.client.models.plant.delete(result.id);
            let leaves = result.progress / 4 * (0.5 + 0.5 * Math.random())
            this.client.models.user.find(msg.author.id).then((user) => {
                if (!user) {
                    this.client.models.user.upsert(msg.author.id, leaves);
                }
                else {
                    this.client.models.user.upsert(msg.author.id, user.dataValues.leaves + leaves);
                }
            })
            msg.say('You\'ve harvested your plant and got :leaves:' + leaves, this.client.utils.generatePlantEmbed(result));
		}).catch((e) => {
			return msg.say('error: ' +  e);
		});
	}
};
