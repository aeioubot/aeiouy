const commando = require('discord.js-commando');

module.exports = class InfoCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'info',
			group: 'plant',
			memberName: 'info',
			description: 'Get info about a garden plant',
			args: [{
				key: 'id',
				type: 'integer',
				prompt: 'Which id? See it with !garden'
			}]
		});
	}

	async run(msg, { id }) {
		if (id < 0) return msg.say('That ID doesn\'t exist.');
		this.client.mods.garden.findOne({ where: { id: msg.guild.id.toString() } }).then(garden => {
			garden.getPlants({ where: {planted: true}}).then(plants => {
				if (id >= plants.length) return msg.say('That ID doesn\'t exist.');
				let plant = plants[id];
				let toSay = 'Here\'s some info about that plant!';
				this.client.utils.generatePlantEmbed(plant, this.client, ['owner']).then(embed => {
					msg.say(toSay, embed);
				});
			});
		});
		return null;//msg.say(`Found seed: #${red}${green}${blue}, growth ${growthRate}`);
	}
};
