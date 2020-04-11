const fs = require('fs')
const Sequelize = require('sequelize');
const config = require('../config.json')
const path = require('path')
const basename = path.basename(__filename);
const sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
    host: config.db.host,
    dialect: config.db.dialect,
    logging: false,
});
const db = {};

//const forbidden = ['db.js', 'plant.js', 'plantType.j']
fs
    .readdirSync(__dirname)
    .filter(file => {
        //console.log(file);
        return (file.indexOf('.') !== 0) && (file !== basename) && (file !== 'db.js') && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).sort((a, b) => (db[a].order || 0) - (db[b].order || 0)).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
//*
db.user.findOrCreate({
    where: {
    id: '94155927032176640',
    email: 'zaop',
}})//*/
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
module.exports = {
    sequelize,
    ...db
}
