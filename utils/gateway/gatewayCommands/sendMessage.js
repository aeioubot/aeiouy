module.exports = async (client, payload) => new Promise((resolve, reject) => {
	if (!client.channels.get(payload.channel)) return reject('Not Found');
	client.channels.get(payload.channel).send(payload.message).then(() => resolve());
});
