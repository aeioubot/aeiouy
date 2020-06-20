const Sequelize = require('sequelize');

const db = require('../database.js').db;

const gardenTable = db.define('2garden', {
	server: {
		type: Sequelize.STRING(25),
	},

	maxPlants: {
		type: Sequelize.INTEGER,
	}
});

gardenTable.sync();

module.exports = {
	findGarden: (server) => gardenTable.find({
		where: {
			server: server,
		}
	}),
};
