module.exports = async (client, payload) => {
	return {
		guilds: client.guilds.size,
		channels: client.channels.size,
		members: client.guilds.map(g => g.memberCount).reduce((a, b) => a + b, 0),
	};
};
