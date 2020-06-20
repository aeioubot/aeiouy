const Sequelize = require('sequelize');

const db = require('../database.js').db;

const table = db.define('inventory', {
	user: {
		type: Sequelize.STRING(25),
	},

	item: {
		type: Sequelize.INTEGER,
	},
});

module.exports = {
	find: (user, extra = {}) => table.findAll({
		where: {
			user,
			...extra,
		},
	}),

	buy: (user, item) => table.upsert({
		user,
		item,
	}),
};
