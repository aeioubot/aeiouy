module.exports = async (sequelize, DataTypes) => {
	const Reaction = sequelize.define('reaction', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		guild: DataTypes.STRING(25),
		type: DataTypes.STRING(20),
		trigger: DataTypes.STRING(2000),
		response: DataTypes.STRING(2000),
	});

	await Reaction.sync();

	return Reaction;
};
