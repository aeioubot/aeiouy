const Sequelize = require('sequelize');
const config = require('../config.json')
const sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
  host: config.db.host,
  dialect: config.db.dialect,
  logging: (...msg) => console.log(msg),
});
module.exports = {sequelize, Sequelize}