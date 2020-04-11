//const cr = require('./models/cr.js');
//const cr = require('./models4').reaction;

class ReactionListener {
	constructor(model) {
		this.model = model;
	}

	check(msg) {
		if (!this.model) return;
		if (msg.author.bot === true || msg.channel.type == 'dm') return;
		this.model.findAll({
			where: {
				guild: msg.guild.id.toString(),
				trigger: msg.content
			}
		}).then((results) => {
			results = results.map((cr) => cr.dataValues);
			if (results.length) {
				msg.channel.send(results[Math.floor(Math.random() * results.length)].response);
			}
		});
	}
}

module.exports = ReactionListener;
/*
return
module.exports = (client, msg) => {
	const cr = client.models.reaction;
	if (msg.author.bot === true || msg.channel.type == 'dm') return;
	console.log({
		guild: msg.guild.id.toString(),
		trigger: msg.content
	})
	cr.findAll({
		where: {
			guild: msg.guild.id.toString(),
			trigger: msg.content
		}
	}).then((results) => {
		console.log(results)
		results = results.map((cr) => cr.dataValues);
		if (results.length) {
			msg.channel.send(results[Math.floor(Math.random() * results.length)].response);
		}
	});
};*/
