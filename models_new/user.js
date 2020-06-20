module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('user', {
		id: {
			type: DataTypes.STRING(25),
			primaryKey: true,
		},
	});

	User.sync();

	User.associate = (models) => {
		User.hasMany(models.plant, {foreignKey: 'owner', targetKey: 'id'});
		User.hasMany(models.item, {foreignKey: 'owner', targetKey: 'id'});
	};

	return User;
};
