const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../database.js').db;

const table = db.define('shopitem', {
    name: {
        type: Sequelize.STRING,
    },
    
    price: {
        type: Sequelize.INTEGER,
    },

    max: {
        type: Sequelize.INTEGER,
    },
}, {
    timestamps: false,
});

module.exports = {
    all: () => {
        return table.findAll();
    },

    find: (query = {}) => {
        return table.findAll({
            where: query
        });
    },

    findByName: (name) => {
        return table.findAll({
            where: {
                name: {
                    [Op.like]: '%' + name + '%'
                }
            }
        })
    },
}