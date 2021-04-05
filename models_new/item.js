module.exports = async (sequelize, DataTypes) => {
	const Item = sequelize.define('item', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		itemtype: DataTypes.STRING,
		owner: DataTypes.STRING(25),
		count: DataTypes.INTEGER,
	});

	await Item.sync();

	Item.associate = async (models) => {
		await Item.belongsTo(models.user, { foreignKey: 'owner', targetKey: 'id' });
		await Item.belongsTo(models.itemType, { foreignKey: 'itemtype', targetKey: 'type' });
	};

	Item.order = 2;

	return Item;
};
