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
		this.client.models.plant.find({server: msg.guild.id, /*planted: true*/}).then(async (result) => {
			const canvas = await this.client.utils.generatePlantCanvas(result, this.client.models.plant.types);
			if (!canvas) return msg.say('This server\'s garden is empty, time to plant some plants!');
			const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

			return msg.say('Garden time', attachment);
		}).catch(e => msg.say('error: ' + e));
	}
};