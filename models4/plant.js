module.exports = (sequelize, DataTypes) => {
    const Plant = sequelize.define('plant', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        owner: DataTypes.STRING(25),
        type: DataTypes.STRING,
        guild: DataTypes.STRING(25),
        color: DataTypes.STRING(6),
        watered: DataTypes.BOOLEAN,
        planted: DataTypes.BOOLEAN,
        progress: DataTypes.TINYINT,
        progressedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        name: DataTypes.STRING(200),
        lastEvent: DataTypes.STRING,
    });

    Plant.sync();

    Plant.associate = (models) => {
        Plant.belongsTo(models.garden, { foreignKey: 'guild', targetKey: 'id' })
        Plant.belongsTo(models.user, { foreignKey: 'owner', targetKey: 'id' });
        Plant.belongsTo(models.plantType, { foreignKey: 'type', targetKey: 'type' })
    }

    Plant.order = 1;

    return Plant;
}