module.exports = (sequelize, DataTypes) => {
	const Reaction = sequelize.define('reaction', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		guild: DataTypes.STRING(25),
		type: DataTypes.STRING(20),
		trigger: DataTypes.STRING(2000),
        trigger_regex: DataTypes.STRING(2000),
		response: DataTypes.STRING(2000),
        is_template: DataTypes.INTEGER,
	});
	return Reaction;
};
