module.exports = (sequelize, DataTypes) => {
    const ItemType = sequelize.define('itemType', {
        type: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name: DataTypes.STRING,
        emoji: DataTypes.STRING,
        description: DataTypes.STRING,
    });

    ItemType.sync();

    ItemType.associate = (models) => {
        ItemType.hasMany(models.item, { foreignKey: 'itemtype', targetKey: 'type' });
    }

    return ItemType;
}