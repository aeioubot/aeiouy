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

	async run(msg, {id}) {
        this.client.models.plant.find({server: msg.guild.id, /*planted: true*/}).then(async (result) => {
            let plant = result[id];
            let toSay = 'Here\'s some info about that plant!'
            this.client.utils.generatePlantEmbed(plant, this.client).then(embed => {
				msg.say(toSay, embed);
			});
        });
		return null;//msg.say(`Found seed: #${red}${green}${blue}, growth ${growthRate}`);
	}
};
