module.exports = async (client, payload) => {
	return {
        guilds: client.guilds.filter(guild => guild.id === payload.id).array(),
	};
};
