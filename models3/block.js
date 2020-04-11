module.exports = (Sequelize, sequelize) => {
    class Block extends Sequelize.Model { }

    Block.init({
        name: Sequelize.STRING,
    }, {
        sequelize,
        modelName: 'block',
    });

    Block.associate = (models) => {
        Block.belongsTo(models.Guy);
    }

    return Block;
}