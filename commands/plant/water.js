// const commando = require('discord.js-commando');

// module.exports = class WaterCommand extends commando.Command {
// 	constructor(client) {
// 		super(client, {
// 			name: 'water',
// 			group: 'plant',
// 			memberName: 'water',
// 			description: 'water your plant',
// 			args: [{
// 				key: 'user',
// 				prompt: 'Which user?',
// 				type: 'user',
// 				default: false,
// 			}],
// 		});
// 	}

// 	async run(msg, { user }) {
// 		this.client.models.plant.find({ user: user ? user.id : msg.author.id, planted: true }).then((result) => {
// 			if (!result || result.length === 0) return user ? msg.say('This user doesn\'t have a plant!') : msg.say('You don\'t have a plant!');
// 			result = result[0].dataValues;
// 			this.client.models.plant.water(result.id);
// 			result = this.client.utils.growPlant(result);
// 			result.watered = true;
// 			msg.say('watered', this.client.utils.generatePlantEmbed(result));
// 		}).catch(e => msg.say('noooo' + e));
// 	}
// };
