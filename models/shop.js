const Sequelize = require('sequelize');

const Op = Sequelize.Op;
const db = require('../database.js').db;

const table = db.define('shopitem', {
	name: {
		type: Sequelize.STRING,
	},

	description: {
		type: Sequelize.STRING,
	},

	price: {
		type: Sequelize.INTEGER,
	},

	max: {
		type: Sequelize.INTEGER,
	},
}, {
	timestamps: false,
});

module.exports = {
	all: () => table.findAll(),

	find: (query = {}) => table.findAll({
		where: query,
	}),

	findByName: (name) => table.findAll({
		where: {
			name: {
				[Op.like]: '%' + name + '%',
			},
		},
	}),
};
