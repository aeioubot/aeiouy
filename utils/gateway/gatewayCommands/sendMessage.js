module.exports = async (client, payload) => new Promise((resolve, reject) => {
	client.channels.fetch(payload.channel).then(channel => {
		if (!channel) return reject('Channel not found');
		channel.send(payload.message).then(()=>resolve()).catch(()=>reject('Error sending message'))
	});
});
