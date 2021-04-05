//const plantmodel = require('../models/plant.js');
// TODO: fix the above import

module.exports = (plant) => {
	plant.progressedAt.setMinutes(0);
	plant.progressedAt.setSeconds(0);
	plant.progressedAt.setMilliseconds(0);
	const timeNow = new Date();
	timeNow.setMinutes(0);
	timeNow.setSeconds(0);
	timeNow.setMilliseconds(0);
	let hoursPassed = (timeNow.getTime() - plant.progressedAt.getTime()) / 3600000;
	plant.progressedAt = new Date();
	if (hoursPassed > 0) plant.watered = false;
	while (hoursPassed > 0) {
		plant.progress += 5 + Math.floor(Math.random() * 5);
		hoursPassed -= 1;
	}
	plant.progress = Math.min(100, plant.progress);
	plantmodel.update(plant.id, plant);
	return plant;
};
