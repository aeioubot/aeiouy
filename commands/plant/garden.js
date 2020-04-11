const commando = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class GardenCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'garden',
			group: 'plant',
			memberName: 'garden',
			aliases: ['g'],
			description: 'See info about the server garden',
			args: [{
				type: 'string',
				key: 'action',
				default: 'view',
				prompt: 'goop'
			}]
		});
	}

	async run(msg) {
		this.client.mods.garden.findOne({ where: { id: msg.guild.id.toString() } }).then((garden) => {
			garden.getPlants({ where: {planted: true}}).then(async plants => {
				this.client.utils.growPlants(plants, {}, async (grownPlants) => {
					const canvas = await this.client.utils.generatePlantCanvas(grownPlants, this.client.models.plant.types);
					if (!canvas) return msg.say('This server\'s garden is empty, time to plant some plants!');
					const attachment = new Discord.Attachment(canvas.toBuffer(), 'server-garden.png');
	
					return msg.say('Here is the server garden!', attachment);
				});
				
			})
		});
		/*
		this.client.models.plant.findAll({ server: msg.guild.id,  }).then(async (result) => {
			const canvas = await this.client.utils.generatePlantCanvas(result, this.client.models.plant.types);
			if (!canvas) return msg.say('This server\'s garden is empty, time to plant some plants!');
			const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

			return msg.say('Garden time', attachment);
		}).catch(e => msg.say('error: ' + e));//*/
	}
};