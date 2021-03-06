const commando = require('discord.js-commando');
const GatewayCommand = require('../../utils/gateway/GatewayCommand');

module.exports = class MsgCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'msg',
			group: 'owner',
			memberName: 'msg',
			description: 'msg',
			aliases: ['m'],
			args: [
				{
					key: 'channel',
					prompt: 'channel id pls',
					type: 'string',
				},
				{
					key: 'message',
					prompt: 'what u say',
					type: 'string',
				}],
		});
	}

	async hasPermission(msg) {
		return (this.client.isOwner(msg.author));
	}

	async run(msg, args) {
		const message = new GatewayCommand({
			client: this.client,
			name: 'sendMessage',
			payload: {
				channel: args.channel,
				message: args.message,
			},
			targets: [],
		});
		console.log(message);
		this.client.gateway.sendCommand(message);
		return msg.say('brbrbrbrbr...');
	}
};
