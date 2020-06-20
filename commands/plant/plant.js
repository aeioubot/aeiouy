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
		if (id < 0) return msg.say('ID has to be greater than or equal to 0');
		this.client.mods.user.findOne({where: {id: msg.author.id}}).then(user => {
			user.getPlants(/*{ where: {planted: false}}*/).then(plants => {
				if (plants.filter(plant => plant.planted == true).length > 30) {
					return msg.say('You already have the maximum number of planted plants');
				}
				const notPlanted = plants.filter(plant => plant.planted == false);
				if (id >= notPlanted.length) return msg.say('This ID does not exist');
				notPlanted[id].update({planted: true, progressedAt: new Date()});
				this.client.utils.generatePlantEmbed(notPlanted[id], this.client).then(embed => {
					msg.say('Planted!', embed);
				});
			});
		});/*
		this.client.models.plant.find({user: msg.author.id}).then((result) => {
			if (result.filter(x => x.dataValues.planted == true).length >= 5) {
				return msg.say('You already have 5 plants! Check them out with !status');
			}
			if (!result[id]) return msg.say('Seed not found');
			this.client.models.plant.plant(result[id].dataValues.id, msg.guild.id);
			return msg.say('seed planted! :sunflower:');
		}).catch(e => msg.say('error: ' + e));//*/
	}
};
