const commando = require('discord.js-commando');

module.exports = class GardenCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'garden',
			group: 'plant',
			memberName: 'garden',
			aliases: ['g'],
			description: 'View the server garden',
			args: [{
				type: 'string',
				key: 'action',
				default: 'view',
				prompt: 'Which action do you want to take? (view)'
			}]
		});
	}

	async run(msg) {
		this.client.mods.garden.findOne({ where: { id: msg.guild.id.toString() } }).then((garden) => {
			garden.getPlants({ where: {planted: true}}).then(async plants => {
				this.client.utils.growPlants(plants, {}, async (grownPlants) => {
					const types = await this.client.mods.plantType.findAll();
					const canvas = await this.client.utils.generatePlantCanvas(grownPlants, types);
					if (!canvas) return msg.say('This server\'s garden is empty, time to plant some plants!');

					return msg.say('Here is the server garden!', {files: [{
						attachment: canvas.toBuffer(),
						name: 'server-garden.png',
					}]});
				});
			});
		});
	}
};
