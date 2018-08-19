const Sequelize = require('sequelize');
const config = require('./config.json');

class Database {
	constructor() {
		this.db = new Sequelize(config.db.name, config.db.username, config.db.password, {
			host: config.db.host,
			dialect: config.db.dialect,
			operatorsAliases: false,
			logging: false,
		});
	}

	async start() {
		await this.db.authenticate();
		this.db.sync()
			.then(() => console.log(`Connected to database!`))
			.catch((err) => console.error(err));
	}
}

module.exports = new Database();
