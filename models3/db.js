const Sequelize = require('sequelize')
const Model = Sequelize.Model
const config = require('../config.json')
const sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
  host: config.db.host,
  dialect: config.db.dialect,
  logging: false,
});
module.exports = {sequelize, Sequelize}