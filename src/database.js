const Sequelize = require('sequelize');
const fs = require('node:fs');
const path = require('node:path')
const config = require('../config.json')

const sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
    host: config.db.host,
    dialect: config.db.dialect,
    storage: config.db.storage,
    logging: false,
});

const models = [];
const modelFiles = fs.readdirSync(path.join(__dirname, './models')).filter(file => file.endsWith('.js'));

for (const file of modelFiles) {
    const model = (require(`./models/${file}`)(sequelize, Sequelize.DataTypes));
    models.push(model);
}

sequelize.sync();

module.exports = sequelize;
