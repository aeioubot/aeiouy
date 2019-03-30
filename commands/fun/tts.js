const commando = require('discord.js-commando');
const { execFile } = require('child_process');
const fs = require('fs');

module.exports = class TtsCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'tts',
			group: 'fun',
			memberName: 'tts',
			description: 'Talkey talk.',
			args: [{
				key: 'text',
				type: 'string',
				prompt: 'What do you want me to say',
				default: '[:rate300]hoo hoo hoo ha ha! hoo hoo hoo he he ha hoo! [:rate200]hello there ol chum! I\'m not a gnelf, I\'m not a gnoblin, I\'m a gnome! And you\'ve been, gnooohmed!',
			}],
		});
	}

	async run(msg, { text }) {
		const filename = `tts-${msg.id}.wav`;
		if (!msg.member.voiceChannelID) return msg.say('join vc!');
		msg.say(':lips:').then((response) => {
			execFile('say.exe', ['-w', filename, '[:phoneme on]' + text], (err) => {
				if (err) throw err;
				msg.guild.channels.get(msg.member.voiceChannelID).join().then((conn) => {
					const dispatcher = conn.playFile(filename);
					dispatcher.on('end', () => {
						if (!conn.dispatcher) conn.channel.leave();
						console.log('Filename:', filename);
						response.delete();
						setTimeout(() => {
							fs.unlink(filename, (err) => {
								if (err) console.error('TTS file was not deleted!', err);
							});
						}, 1000);
					});
				});
			});
		});
		return null;
	}
};
