const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../database.js').db;

const table = db.define('inventory', {
    user: {
        type: Sequelize.STRING(25),
    },

    item: {
        type: Sequelize.INTEGER,
    },
});

module.exports = {
    find: (user, extra = {}) => {
        return table.findAll({
            where: {
                user: user,
                ...extra
            }
        })
    },

    buy: (user, item) => {
        return table.upsert({
            user: user,
            item: item,
        })
    },
}