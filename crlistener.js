const cr = require('./models/cr.js');

module.exports = (msg) => {
	if (msg.author.bot === true || msg.channel.type == 'dm') return;
	cr.find(msg.guild.id, msg.content).then((results) => {
		results = results.map((cr) => cr.dataValues);
		if (results.length) {
			msg.channel.send(results[Math.floor(Math.random() * results.length)].response);
		}
	});
};
