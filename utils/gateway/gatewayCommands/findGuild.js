module.exports = async (client, payload) => {
	return {
		guild: client.guilds.cache.get(payload.id),
	};
};
