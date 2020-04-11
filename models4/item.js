module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define('item', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        itemtype: DataTypes.STRING,
        owner: DataTypes.STRING(25),
        count: DataTypes.INTEGER,
    });

    Item.sync();

    Item.associate = (models) => {
        Item.belongsTo(models.user, { foreignKey: 'owner', targetKey: 'id' });
        Item.belongsTo(models.itemType, { foreignKey: 'itemtype', targetKey: 'type' });
    }

    Item.order = 2;

    return Item;
}