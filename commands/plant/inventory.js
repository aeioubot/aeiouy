const commando = require('discord.js-commando');

module.exports = class InventoryCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'inventory',
			group: 'plant',
			memberName: 'inventory',
			description: 'view inventory',
			aliases: ['inv'],
			args: [{
				type: 'string',
				key: 'action',
				default: 'list',
				prompt: 'action',
			}, {
				type: 'string',
				key: 'emoji',
				default: '',
				prompt: 'item',
			}, {
				type: 'string',
				key: 'extra',
				default: '',
				prompt: 'what',
			}]
		});
	}

	async run(msg, args) {
		let client = this.client;
		const {action, emoji} = args;
		this.client.mods.user.findOne({where: {id: msg.author.id}}).then(user => {
			console.log(-1);
			user.getItems().then(async inventory => {
				switch(action) {
				case 'use': {
					if (inventory.length == 0) return msg.say('You don\'t have any items to use.');

					if (emoji == '') return msg.say('Please specify which item');
					let itemType = await this.client.mods.itemType.findOne({where: {emoji: emoji}});

					if (!itemType) return msg.say('That item does not exist.');

					const inventoryItem = inventory.find(item => {
						console.log(item.itemtype, itemType.type, itemType.id);
						return item.itemtype == itemType.type;
					});

					if (!inventoryItem) return msg.say('You do not have this item');

					inventoryItem.update({count: inventoryItem.count - 1});

					if (inventoryItem.count == 0) inventoryItem.destroy();
					require('../../items/' + itemType.type + '.js')({client, msg, args});

					break;
				}
				default: {
					if (inventory.length === 0) {
						return msg.say('You don\'t have any items!');
					}
					let output = 'Here\'s your inventory:\n';
					for (let i = 0; i < inventory.length; i++) {
						let typeInfo = await inventory[i].getItemType();
						output += `${typeInfo.emoji} | ${typeInfo.name} (${inventory[i].count})\n`;
					}
					msg.say(output);
				}
				}
			});
		});
	}
};
