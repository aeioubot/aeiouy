module.exports = async (sequelize, DataTypes) => {
	const ItemType = sequelize.define('itemType', {
		type: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		name: DataTypes.STRING,
		emoji: DataTypes.STRING,
		description: DataTypes.STRING,
	});

	await ItemType.sync();

	ItemType.associate = async (models) => {
		await ItemType.hasMany(models.item, { foreignKey: 'itemtype', targetKey: 'type' });
	};

	return ItemType;
};
