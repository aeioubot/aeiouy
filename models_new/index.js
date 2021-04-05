const fs = require('fs');
const Sequelize = require('sequelize');
const config = require('js-yaml').load(fs.readFileSync(__dirname + '/../config.yaml'));
const path = require('path');
const basename = path.basename(__filename);

const sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
	host: config.db.host,
	dialect: config.db.dialect,
	logging: (m) => { console.log(m) },
	define: {
		freezeTableName: true,
	}
});

async function main() {
	return new Promise(async (resolve, reject) => {
		const db = {
			sequelize,
		};
		const files = fs.readdirSync(__dirname)
			.filter(file => {
				return (file !== basename) && (file.slice(-3) === '.js');
			});
		for (const file of files) {
			const model = await (require(path.join(__dirname, file)))(sequelize, Sequelize.DataTypes);
			db[model.name] = model;
		}
		for (const modelName in db) {
			await db[modelName].associate?.(db);
		}
		sequelize.sync({ force: true });
		resolve(db);
	});
}

module.exports = main;

/*
db.user.findAll().then(users => {
	//console.log(users);
	db.plantType.findAll().then(types => {
		if (types.length == 0) return;
		users.forEach(user => {
			/*user.createPlant({
				leaves: Math.floor(Math.random() * 100),
				type: 'flower',
			}, {
				includes: [{
					association: db.plant.type
				}, {
					association: db.plant.owner
				}]
			});//*//*
});
})
})

db.plant.findAll({
includes: [{
association: db.plant.type,
model: db.plantType,
as: 'plantType',
through: { attributes: [] }
}, {
model: db.plantType,
required: true,
as: 'plantType',
foreignKey: 'type',
}]
}).then(plants => {
plants.forEach(plant => {
console.log(plant.type)
})
})
/*
db.reaction.findAll({
where: {
'trigger': 'boop'
}
}).then(crs => {
console.log('oop', crs)
})
*/
