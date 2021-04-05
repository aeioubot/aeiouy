module.exports = async (sequelize, DataTypes) => {
	const Garden = sequelize.define('garden', {
		id: {
			type: DataTypes.STRING(25), //guild id
			primaryKey: true,
		},
		name: DataTypes.STRING(200),
	});

	await Garden.sync();

	Garden.associate = async (models) => {
		await Garden.hasMany(models.plant, {foreignKey: 'guild', targetKey: 'id'});
	};

	return Garden;
};
