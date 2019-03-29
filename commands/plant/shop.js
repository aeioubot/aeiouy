const commando = require('discord.js-commando');

module.exports = class ShopCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'shop',
			group: 'plant',
			memberName: 'shop',
			description: 'view shop',
		});
	}

	async run(msg) {
        this.client.models.shop.all().then((result) => {
            result = result.map(x => x.dataValues);
            result = result.map((item, index) => {
                return ` - ${item.name}, costs :leaves: ${item.price}. Max ${item.max}.`
            });
            return msg.say('Shop:\n' + result.join('\n'));
        }).catch((e) => {
			return msg.say('noooo' +  e);
		});
	}
};
