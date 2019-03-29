const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../database.js').db;

const table = db.define('customreaction', {
    guild: {
        type: Sequelize.STRING(25),
    },

    trigger: {
        type: Sequelize.STRING(2000),
    },

    response: {
        type: Sequelize.STRING(2000),
    },
});

module.exports = {
    create: (guild, trigger, response) => {
        return table.upsert({guild: guild, trigger: trigger, response: response}, {
            where: {
                guild: guild,
                trigger: trigger,
            }
        })
    },
    find: (guild, trigger, response) => {
        let where = {
            guild: guild,
            trigger: trigger,
        }
        if (response) where.response = response;
        return table.findAll({
            where: where,
        })
    },
    getAll: (guild) => {
        return table.findAll({
            where: {
                guild: guild,
            }
        })
    },
    deleteByTrigger: (guild, trigger, response) => {
        let where = {
            guild: guild,
            trigger: trigger,
        }
        if (response) where.response = response;
        return table.destroy({
            where: where
        })
    },
    deleteById: (id) => {
        return table.destroy({
            where: {
                id: id,
            }
        })
    }
}