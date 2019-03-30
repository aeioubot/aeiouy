const Sequelize = require('sequelize');

const Op = Sequelize.Op;
const db = require('../database.js').db;

const table = db.define('customreaction', {
	guild: {
		type: Sequelize.STRING(25),
	},

	trigger: {
		type: Sequelize.STRING(2000),
	},

	response: {
		type: Sequelize.STRING(2000),
	},
});

module.exports = {
	create: (guild, trigger, response) => table.upsert({ guild, trigger, response }, {
		where: {
			guild,
			trigger,
		},
	}),
	find: (guild, trigger, response) => {
		const where = {
			guild,
			trigger,
		};
		if (response) where.response = response;
		return table.findAll({
			where,
		});
	},
	getAll: guild => table.findAll({
		where: {
			guild,
		},
	}),
	deleteByTrigger: (guild, trigger, response) => {
		const where = {
			guild,
			trigger,
		};
		if (response) where.response = response;
		return table.destroy({
			where,
		});
	},
	deleteById: id => table.destroy({
		where: {
			id,
		},
	}),
};
