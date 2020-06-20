const Sequelize = require('sequelize');
const fs = require('fs');
const config = require('js-yaml').load(fs.readFileSync('../config.yaml'));
const sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
	host: config.db.host,
	dialect: config.db.dialect,
	logging: (...msg) => console.log(msg),
});
module.exports = {sequelize, Sequelize};
