//const cr = require('./models/cr.js');
//const cr = require('./models_new').reaction;

class ReactionListener {
	constructor(model) {
		this.model = model;
	}

	check(msg) {
		console.log('chekin')
		console.log(this.model);
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
