const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../database.js').db;

const table = db.define('user', {
    user: {
        type: Sequelize.STRING(25),
        unique: true,
    },
    
    leaves: {
        type: Sequelize.INTEGER,
    },
});

module.exports = {
    find: (user) => {
        return table.findOne({
            where: {
                user: user,
            }
        });
    },

    upsert: (user, leaves = 0) => {
        return table.upsert({
            user: user,
            leaves: leaves,
        });
    },
}