const Sequelize = require('sequelize');
const config = require('./config.json');

class Database {
	constructor() {
		this.db = new Sequelize(config.db.name, config.db.username, config.db.password, {
			host: config.db.host,
			dialect: config.db.dialect,
			logging: false,
		});

		this.models = {};
	}

	setModels(models) {
		this.models = models;
	}


	async start() {
		await this.db.authenticate().then(() => {
			this.db.sync()
				.then(() => console.log('Connected to database!'))
				.catch((err) => {
					console.error(err);
				});
		}).catch((e) => {
			if (e.name === 'SequelizeConnectionRefusedError') {
				console.fatal('Database connection refused, is the database online?');
			}
		});
	}
}

module.exports = new Database();
