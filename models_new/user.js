module.exports = async (sequelize, DataTypes) => {
	const User = sequelize.define('user', {
		id: {
			type: DataTypes.STRING(25),
			primaryKey: true,
		},
	});

	await User.sync();

	User.associate = async (models) => {
		await User.hasMany(models.plant, {foreignKey: 'owner', targetKey: 'id'});
		await User.hasMany(models.item, {foreignKey: 'owner', targetKey: 'id'});
	};

	return User;
};
