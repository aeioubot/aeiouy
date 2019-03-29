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

	async run(msg) {
        let red = Math.floor(Math.random() * 256).toString(16); // 0 - 255
        if (red.length == 1) red = '0' + red;
        let green = Math.floor(Math.random() * 256).toString(16); // 0 - 255
        if (green.length == 1) green = '0' + green;
        let blue = Math.floor(Math.random() * 256).toString(16); // 0 - 255
        if (blue.length == 1) blue = '0' + blue;
        let colour = red + green + blue;
        let growthRate = Math.floor(Math.random() * 100); // 0 - 99
        let waterAffinity = Math.floor(Math.random() * 100); // 0 - 99
        let leafiness = Math.floor(Math.random() * 100); // 0 - 99
        let name = 'An unnamed seed';
        this.client.models.plant.create(msg.author.id, colour, growthRate, waterAffinity, leafiness, name);
        return msg.say(`Found seed: #${red}${green}${blue}, growth ${growthRate}`)
	}
};
