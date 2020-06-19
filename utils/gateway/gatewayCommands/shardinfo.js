module.exports = async (client, payload) => {
	return {
		guilds: client.guilds.cache.size,
		channels: client.channels.cache.size,
		members: client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b, 0),
	};
};
