const commando = require('discord.js-commando');
const GatewayCommand = require('../../GatewayCommand.js');

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
					key: 'guild',
					prompt: 'Which guild yo',
					type: 'string',
				},
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

	async run(msg, args) {
		const message = new GatewayCommand({
			name: 'sendMessage', 
			payload: {
				guild: args.guild,
				channel: args.channel,
				message: args.message
			}, 
			targets: 'all'
		});
        console.log(message);
        this.client.gateway.sendCommand(message);
		return msg.say('brbrbrbrbr...');
	}
};
