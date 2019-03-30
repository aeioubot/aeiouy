const commando = require('discord.js-commando');

module.exports = class BuyCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'buy',
			group: 'plant',
			memberName: 'buy',
			description: 'buy a cool item',
			args: [{
				key: 'name',
				prompt: 'Which shop item?',
				type: 'string',
			}],
		});
	}

	async run(msg, { name }) {
		this.client.models.shop.findByName(name).then((itemResult) => {
			console.log(itemResult);
			if (itemResult.length === 0) return msg.say('No items found');
			if (itemResult.length > 1) return msg.say('Multiple found: ' + itemResult.map(x => x.dataValues.name).join(', '));
			itemResult = itemResult[0].dataValues;
			this.client.models.inventory.find(msg.author.id).then((inventory) => {
				if (inventory.length === 0) {
					return msg.say('Your inventory is empty!');
				}
				inventory = inventory.map(x => x.dataValues).filter(invItem => invItem.item === itemResult.id);
				if (inventory.length < itemResult.max) {
					this.client.models.inventory.buy(msg.author.id, itemResult.id);
					return msg.say('bought ' + itemResult.name);
				}
				return msg.say('Don\'t be ridiculous, you can\'t have more than ' + itemResult.max + ' ' + itemResult.name + 's!');
			}).catch(e => msg.say('Something went wrong: ' + e));
		}).catch(e => msg.say('Something went wrong: ' + e));
	}
};
