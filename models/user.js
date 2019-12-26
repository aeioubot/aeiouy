const Sequelize = require('sequelize');

const Op = Sequelize.Op;
const db = require('../database.js').db;

const table = db.define('user', {
	user: {
		type: Sequelize.STRING(25),
		unique: true,
	},

	leaves: {
		type: Sequelize.INTEGER,
	},

	home: {
		type: Sequelize.STRING(25)
	}
});

module.exports = {
	find: (user) => table.findOne({
		where: {
			user,
		},
	}),

	upsert: (user, leaves = 0) => table.upsert({
		user,
		leaves,
	}),
};
