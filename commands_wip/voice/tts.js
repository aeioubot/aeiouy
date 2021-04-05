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
				default: '[:rate300]hoo hoo hoo ha ha! hoo hoo hoo he he ha hoo! [:rate200]hello there ol chum! I\'m not a gnelf, I\'m not a gnoblin, I\'m a guh nowm! And you\'ve been, gnooohmed!',
			}],
		});
	}

	async run(msg, { text }) {
		//return msg.say('Sorry, this command is currently not available.');
		const filename = `/tmp/tts-${msg.id}.wav`;
		if (!msg.member.voice.channelID) return msg.say('join vc!');
		msg.say(':lips: generating voice...').then((response) => {
			// path is relative to working directory.  '-d', './utils/dectalk/dtalk_us.dic', does not seem to work.
			execFile('wine', ['./utils/dectalk/say.exe', '-w', filename, '[:phoneme on]' + text], async (err) => {
				if (err) throw err;
				await response.edit(':lips: connecting...');
				msg.guild.channels.cache.get(msg.member.voice.channelID).join().then(async (conn) => {
					await response.edit(':lips: speaking...');
					const dispatcher = conn.play(filename);
					dispatcher.on('error', (e) => {
						console.error('Voice error', e);
					});
					dispatcher.on('speaking', (isSpeaking) => {
						if (isSpeaking) return;
						if (!conn.dispatcher) conn.channel.leave();
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
