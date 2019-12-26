const Sequelize = require('sequelize');

const Op = Sequelize.Op;
const db = require('../database.js').db;

const table = db.define('seed', {
	user: {
		type: Sequelize.STRING(25),
	},

	server: {
		type: Sequelize.STRING(25),
	},

	type: {
		type: Sequelize.STRING(50),
	},

	colour: {
		type: Sequelize.STRING(6),
	},

	// growthRate: {
	// 	type: Sequelize.INTEGER,
	// },

	// waterAffinity: {
	// 	type: Sequelize.INTEGER,
	// },

	// leafiness: {
	// 	type: Sequelize.INTEGER,
	// },

	watered: {
		type: Sequelize.BOOLEAN,
	},

	planted: {
		type: Sequelize.BOOLEAN,
	},

	progress: {
		type: Sequelize.TINYINT,
	},

	progressedAt: {
		type: Sequelize.DATE,
	},

	name: {
		type: Sequelize.STRING(200),
	},

	lastEvent: {
		type: Sequelize.STRING,
	},
});

table.sync();

module.exports = {
	types: require('../config_planttypes.js'),

	create: (user, server, type, colour, growthRate, waterAffinity, leafiness, name) => table.upsert({
		user,
		server,
		type,
		colour,
		// growthRate,
		// waterAffinity,
		// leafiness,
		watered: false,
		planted: false,
		name,
		lastEvent: 'Found this seed',
	}),

	find: (extra = {}) => table.findAll({
		where: {
			...extra,
		},
	}),

	plant: (seed, server) => table.update({
		planted: true,
		progress: 0,
		progressedAt: new Date(),
		server: server,
	}, {
		where: {
			id: seed,
		},
	}),

	update: (seed, obj) => table.update(obj, {
		where: {
			id: seed,
		},
	}),

	water: seed => table.update({
		watered: true,
	}, {
		where: {
			id: seed,
		},
	}),

	delete: seed => table.destroy({
		where: {
			id: seed,
		},
	}),
};
