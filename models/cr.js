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
    }
}