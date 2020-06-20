module.exports = (plants, {bonus = 0}, cb) => {
	plants = plants.map((plant) => {
		return new Promise(async (resolve) => {
			let type = await plant.getPlantType();
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
				if (plant.watered) {
					plant.progress += type.wateredBaseGrowth + Math.floor(Math.random() * type.wateredRandomGrowth);
					plant.watered = false;
				}
				else {
					plant.progress += type.baseGrowth + Math.floor(Math.random() * type.randomGrowth);
				}
				hoursPassed -= 1;
			}
			plant.progress = Math.min(100, plant.progress + bonus);
			plant.save();
			resolve(plant);
		});
	});
	Promise.all(plants).then((values) => {
		cb(values);
	});
};
