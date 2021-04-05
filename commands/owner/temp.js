const commando = require('discord.js-commando');

module.exports = class TempCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'temp',
			group: 'owner',
			memberName: 'temp',
			description: 'temp test',
			args: [
				{
					key: 'id',
					prompt: 'id pls',
					type: 'integer',
				}],
		});
	}

	async hasPermission(msg) {
		return (this.client.isOwner(msg.author));
	}

	async run(msg, { id }) {
		if (id < 0) return msg.say('2 small id');
		this.client.mods.user.findOne({ where: { id: msg.author.id } }).then(user => {
			user.getPlants().then(plants => {
				if (id >= plants.length) return msg.say('2 big id');
				let plant = plants[id];
				plant.progressedAt.setMinutes(0);
				plant.progressedAt.setMinutes(0);
				plant.progressedAt.setSeconds(0);
				plant.progressedAt.setMilliseconds(0);
				const timeNow = new Date();
				timeNow.setMinutes(0);
				timeNow.setSeconds(0);
				timeNow.setMilliseconds(0);
				let hoursPassed = (timeNow.getTime() - plant.progressedAt.getTime()) / 3600000;
				plant.progressedAt = new Date();
				if (hoursPassed > 0) plant.watered = false;
				while (hoursPassed > 0) {
					plant.progress += 5 + Math.floor(Math.random() * 5);
					hoursPassed -= 1;
				}
				plant.progress = Math.min(100, plant.progress);
				plant.save();
			});
		});
	}
};
