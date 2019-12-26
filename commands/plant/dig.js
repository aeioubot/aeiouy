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
		const plantTypes = this.client.models.plant.types;
		//const type = ['flower', 'wheat'][Math.floor(Math.random()*2)];
		const type = Object.keys(plantTypes)[Math.floor(Math.random()*2)];
		console.log(Object.keys(plantTypes));
		let colour;
		if (plantTypes[type].colorEnabled === true) {
			let red = ('0' + Math.floor(Math.random() * 256).toString(16)).slice(-2); // 0 - 255
			let green = ('0' + Math.floor(Math.random() * 256).toString(16)).slice(-2); // 0 - 255
			let blue = ('0' + Math.floor(Math.random() * 256).toString(16)).slice(-2); // 0 - 255
			colour = red + green + blue;
		}
		else {
			colour = plantTypes[type].defaultColor || '000000';
		}
		const growthRate = Math.floor(Math.random() * 100); // 0 - 99
		const waterAffinity = Math.floor(Math.random() * 100); // 0 - 99
		const leafiness = Math.floor(Math.random() * 100); // 0 - 99
		const name = 'An unnamed seed';
		this.client.models.plant.create(msg.author.id, msg.guild.id, type, colour, growthRate, waterAffinity, leafiness, name);
		this.client.utils.generatePlantEmbed({server: msg.guild.id, type, colour, growthRate, waterAffinity, name, leafiness}, this.client).then(embed => {
			msg.say('Found seed:', embed);
		});
		return null;//msg.say(`Found seed: #${red}${green}${blue}, growth ${growthRate}`);
	}
};
