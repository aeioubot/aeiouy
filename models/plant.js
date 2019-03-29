const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../database.js').db;

const table = db.define('seed', {
    user: {
        type: Sequelize.STRING(25),
    },

    colour: {
        type: Sequelize.STRING(6),
    },

    growthRate: {
        type: Sequelize.INTEGER,
    },

    waterAffinity: {
        type: Sequelize.INTEGER,
    },

    leafiness: {
        type: Sequelize.INTEGER,
    },

    watered: {
        type: Sequelize.BOOLEAN,
    },

    planted: {
        type: Sequelize.BOOLEAN,
    },

    progress: {
        type: Sequelize.TINYINT,
    },

    progressedAt: {
        type: Sequelize.DATE,
    },

    name: {
        type: Sequelize.STRING(200),
    },

    lastEvent: {
        type: Sequelize.STRING,
    }
});

module.exports = {
    create: (user, colour, growthRate, waterAffinity, leafiness, name) => {
        return table.upsert({
            user: user,
            colour: colour,
            growthRate: growthRate,
            waterAffinity: waterAffinity,
            leafiness: leafiness,
            watered: false,
            planted: false,
            name: name,
            lastEvent: 'Found this seed',
        })
    },

    find: (user, extra = {}) => {
        return table.findAll({
            where: {
                user: user,
                ...extra
            }
        })
    },

    plant: (seed) => {
        return table.update({
            planted: true,
            progress: 0,
            progressedAt: new Date()
        }, {
            where: {
                id: seed,
            }
        })
    },

    update: (seed, obj) => {
        return table.update(obj, {
            where: {
                id: seed,
            }
        })
    },

    water: (seed) => {
        return table.update({
            watered: true,
        }, {
            where: {
                id: seed,
            }
        })
    },

    delete: (seed) => {
        return table.destroy({
            where: {
                id: seed,
            }
        })
    }
}