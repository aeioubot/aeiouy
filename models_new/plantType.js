module.exports = async (sequelize, DataTypes) => {
	const PlantType = sequelize.define('plantType', {
		type: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		name: DataTypes.STRING,
		colorEnabled: DataTypes.BOOLEAN,
		defaultColor: DataTypes.STRING(6),
		baseGrowth: DataTypes.INTEGER,
		randomGrowth: DataTypes.INTEGER,
		wateredBaseGrowth: DataTypes.INTEGER,
		wateredRandomGrowth: DataTypes.INTEGER,
		maxStage: DataTypes.INTEGER,
	});

	await PlantType.sync();

	PlantType.associate = async (models) => {
		await PlantType.hasMany(models.plant, { foreignKey: 'type', targetKey: 'type' });
	};

	return PlantType;
};
