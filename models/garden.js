const Sequelize = require('sequelize');

const Op = Sequelize.Op;
const db = require('../database.js').db;

const gardenTable = db.define('garden', {
	server: {
		type: Sequelize.STRING(25),
	},

	maxPlants: {
		type: Sequelize.INTEGER,
	}
})

gardenTable.sync();

module.exports = {
	findGarden: (server) => table.find({
		where: {
			server: server,
		}
	}),
}