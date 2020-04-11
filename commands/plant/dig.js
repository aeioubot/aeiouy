const commando = require('discord.js-commando');

module.exports = class DigCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'dig',
			group: 'plant',
			memberName: 'dig',
			description: 'Dig up a new seed',
		});
	}

	async run(msg) { // ffc000
		const plantTypes = await this.client.mods.plantType.findAll()
		//const type = ['flower', 'wheat'][Math.floor(Math.random()*2)];
		const type = plantTypes[Math.floor(Math.random()*plantTypes.length)];
		let colour;
		if (type.colorEnabled === true) {
			let red = ('0' + Math.floor(Math.random() * 256).toString(16)).slice(-2); // 0 - 255
			let green = ('0' + Math.floor(Math.random() * 256).toString(16)).slice(-2); // 0 - 255
			let blue = ('0' + Math.floor(Math.random() * 256).toString(16)).slice(-2); // 0 - 255
			colour = red + green + blue;
		}
		else {
			colour = type.defaultColor || '000000';
		}
		const growthRate = Math.floor(Math.random() * 100); // 0 - 99
		const waterAffinity = Math.floor(Math.random() * 100); // 0 - 99
		const leafiness = Math.floor(Math.random() * 100); // 0 - 99
		const name = 'An unnamed seed';
		this.client.mods.garden.findOrCreate({
			where: {
				id: msg.guild.id.toString(),
			}
		}).then((garden) => {
			console.log('garden', garden);
			garden[0].createPlant({
				owner: msg.author.id.toString(),
				type: type.type,
				guild: msg.guild.id.toString(),
				color: colour,
				watered: false,
				planted: false,
				progress: 0,
				name: name,
				lastEvent: 'Found this seedy',
			}, {
				includes: [{
					association: this.client.mods.plant.type,
				}, {
					association: this.client.mods.plant.owner,
				}, {
					association: this.client.mods.plant.guild,
				}]
			}).then(plant => { // {server: msg.guild.id, type, colour, growthRate, waterAffinity, name, leafiness}
				this.client.utils.generatePlantEmbed(plant, this.client).then(embed => {
					msg.say('Found seed:', embed);
				});
			});
		})
		
		return null;//msg.say(`Found seed: #${red}${green}${blue}, growth ${growthRate}`);
	}
};
