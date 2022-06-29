const { SlashCommandBuilder } = require('@discordjs/builders');

const responses = [
	'hi',
	'Hello!!',
	'Henlo!',
	'Hi there.',
	'aaaaaa',
	'I\'m listening.',
	'Yes?',
	'Hi, how are you?',
	'Hey there.',
	'yes hi its me',
	'yes hello this is aeiou',
	'Hi, I\'m Aeiou.',
	'Greetings!!',
	'I am here!',
	'Ready to serve!',
	'Pong!',
	'ATTENTION REQUESTED?',
	'Yes, I am here.',
	'Yes, that\'s me!',
	'What\'s good?',
	'Yeah?',
	'I read you.',
	'I hear you.',
	'Watching!',
	'You got me.',
	'I\'m not sleeping!!!',
	'\\*krrt* Aeiou to Earth, are you reading?',
	'You called?',
	'I\'m alive!',
	'Hearing you, loud and clear!',
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check aeiou\'s status')
		.addBooleanOption(option =>
			option.setName('time')
				.setDescription('Show the latency in ms')),
	help: 'Use this to check if aeiou is online. Specify `time: true` to see the latency.',
	async execute(interaction) {
		const time = interaction.options.getBoolean('time');
		if (time) {
			await interaction.reply({ content: `determining ping...`, fetchReply: true}).then(message => {
				interaction.editReply(`pong! this reply took ${message.createdTimestamp - interaction.createdTimestamp}ms, API latency is ${Math.round(interaction.client.ws.ping)}ms`);
			});
		}
		else {
			await interaction.reply(responses[Math.floor(responses.length * Math.random())]);
		}
	},
};
