const Sequelize = require('sequelize');

const Op = Sequelize.Op;
const db = require('../database.js').db;

const table = db.define('item', {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: Sequelize.INTEGER
	},
    
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


// class User extends Model { }
// User.init({
//     name: Sequelize.STRING,
//     email: Sequelize.STRING
// }, {
//     sequelize,
//     modelName: 'user'
// });

// class Project extends Model { }
// Project.init({
//     name: Sequelize.STRING
// }, {
//     sequelize,
//     modelName: 'project'
// });

// User.hasOne(Project)
