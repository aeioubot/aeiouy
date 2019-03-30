const commando = require('discord.js-commando');

module.exports = class InventoryCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'inventory',
			group: 'plant',
			memberName: 'inventory',
			description: 'view inventory',
			aliases: ['inv'],
		});
	}

	async run(msg) {
		this.client.models.inventory.find(msg.author.id).then((result) => {
			if (result.length === 0) {
				return msg.say('Your inventory is empty!');
			}
			result = result.map(x => x.dataValues);
			this.client.models.shop.all().then((shopItems) => {
				// array of available shop items
				shopItems = shopItems.map(shopItem => shopItem.dataValues);
				// go through all items in the inventory and write the name of the matched shop item
				result = result.map((item, index) => `${index}. ${shopItems.filter(shopitem => shopitem.id === item.item)[0].name}`);
				return msg.say('Items:\n' + result.join('\n'));
			});
		}).catch(e => msg.say('noooo' + e));
	}
};
