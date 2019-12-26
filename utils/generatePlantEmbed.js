const { RichEmbed, Attachment } = require('discord.js');
const GatewayCommand = require('./gateway/GatewayCommand');
const Canvas = require('canvas');

module.exports = (plant, client) => {
	return new Promise((resolve, reject) => {
		let embed = new RichEmbed()
		.setTitle(plant.name)
		.setColor('#' + plant.colour)
		.setDescription(plant.lastEvent || 'You found this seed!');
		if (plant.planted) {
			const message = new GatewayCommand({
				client: client,
				name: 'findGuild',
				payload: {
					id: plant.server,
				},
				targets: [],
			});
			client.gateway.sendCommand(message).then(responses => {
				let guilds = [];
				responses.forEach(response => {
					guilds.push(...response.payload.guilds);
				});
				let serverName = guilds[0] ? guilds[0].name : plant.server;

				let typeInfo = client.models.plant.types[plant.type];
				let stage = Math.floor(plant.progress / 100 * typeInfo.maxStage);
				let plantImageFileName = plant.type + '_' + stage + '.png';
				const totalWidth = 90;
				const totalHeight = 90;

				const canvas = Canvas.createCanvas(totalWidth, totalHeight);
				const ctx = canvas.getContext('2d');

				ctx.imageSmoothingEnabled = false;

				
				const img = Canvas.loadImage('./img/' + plantImageFileName).then(img => {
					ctx.drawImage(img, 0, 0, 90, 90);
					
					if (typeInfo.colorEnabled) {
						//console.log(1)
						// Replace white with the custom colour. Could move this to the config if white is desired as a plant colour
						let oldColor = [255, 255, 255];
						let oldColorComp = [0, 0, 0];
						let newColor = plant.colour.match(/[a-f\d]{2}/g).map(x=>parseInt(x,16))
						//console.log(newColor)
						let newColorComp = newColor.map(x => x ^ 255)
						
						var imageData = ctx.getImageData(0, 0, 90, 90);
						//console.log(imageData);
						for (var j=0; j < imageData.data.length; j += 4) {
							if (compareArray(imageData.data.slice(j, j+3), oldColor)) {
								imageData.data[j]   = newColor[0];
								imageData.data[j+1] = newColor[1];
								imageData.data[j+2] = newColor[2];
							} else if (compareArray(imageData.data.slice(j, j+3), oldColorComp)) {
								imageData.data[j]   = newColorComp[0];
								imageData.data[j+1] = newColorComp[1];
								imageData.data[j+2] = newColorComp[2];
							}
						}
						ctx.putImageData(imageData, 0, 0);
					}
	
					embed.attachFiles([new Attachment(canvas.toBuffer(), 'plant-image.png')])
						.setThumbnail('attachment://plant-image.png');
	
					embed.addField(
						'Type',
						plant.type,
						true,
					)
					.addField(
						'Watered',
						(plant.watered ? 'Yes' : 'No'),
						true,
					)
					.addField(
						'Progress',
						plant.progress + '%',
						true,
					)
					.addField(
						'Server',
						serverName,
						true,
					);
					resolve(embed);
				});

				
			});
			
		}
		else {
			resolve(embed);
		}
	})
}

function compareArray(a, b) {
	if (a.length !== b.length) throw new Error('Wrong length, yo');
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}
