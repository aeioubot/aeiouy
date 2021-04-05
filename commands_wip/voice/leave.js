const commando = require('discord.js-commando');
const { execFile } = require('child_process');
const fs = require('fs');

module.exports = class LeaveCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'leave',
			group: 'fun',
			memberName: 'leave',
			description: 'Leave the voice channel.',
		});
	}

	async run(msg, { text }) {
        // if not in voice channel then return msg.say I am not in a voice channel
        if (!msg.member.voice.channelID) return msg.say('You need to be in my voice channel to use this command'); 
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
