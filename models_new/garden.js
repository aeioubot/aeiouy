module.exports = (sequelize, DataTypes) => {
	const Garden = sequelize.define('garden', {
		id: {
			type: DataTypes.STRING(25), //guild id
			primaryKey: true,
		},
		name: DataTypes.STRING(200),
	});

	Garden.sync();

	Garden.associate = (models) => {
		Garden.hasMany(models.plant, {foreignKey: 'guild', targetKey: 'id'});
	};

	return Garden;
};
