const Canvas = require('canvas');

module.exports = async (result) => {
	const totalWidth = 700;
	const totalHeight = 500;
	const boxPadding = 10;
	if (!result || result.length === 0) return false;

	const canvas = Canvas.createCanvas(totalWidth, totalHeight);
	const ctx = canvas.getContext('2d');
	//ctx.antialias = 'subpixel';
	// Make the pixely plants appear nice and not blurred out
	ctx.imageSmoothingEnabled = false;

	// Brown background (ground)
	ctx.fillStyle = '#a06220';
	ctx.fillRect(0, 50, totalWidth, totalHeight - 50);

	// Top bar with info (plant count etc)
	ctx.font = '35px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText(result.length.toString() + ' plant' + (result.length > 1 ? 's' : ''), 25, 40);

	// Width and height of the plants
	let size = best_square(totalWidth, totalHeight - 50, result.length);

	// Top left X and Y coordinates of the first plant-square
	let xdraw = 0;
	let ydraw = 50;

	// Plant numbers
	ctx.font = '20px sans-serif';
	ctx.textAlign = 'right';

	for (let i = 0; i < result.length; i++) {
		// Go to the next line if the plant doesn't fit horizontally
		if (xdraw + size > totalWidth) {
			xdraw = 0;
			ydraw += size;
		}
		//ctx.fillStyle = `hsl(${Math.floor(Math.random()*360)}, 100%, 50%)`;

		let typeInfo = await result[i].getPlantType();
		let stage = Math.floor(result[i].progress / 100 * typeInfo.maxStage);
		const img = await Canvas.loadImage('./img/' + result[i].type + '_' + stage + '.png');

		// Make the image not exceed the max drawing square if it's not a square image
		let drawheight = 0;
		let drawwidth = 0;
		if (img.naturalHeight > img.naturalWidth) {
			drawheight = size;
			drawwidth = size * (img.naturalWidth / img.naturalHeight);
		} else if (img.naturalHeight > img.naturalWidth) {
			drawwidth = size;
			drawheight = size * (img.naturalHeight / img.naturalWidth);
		} else {
			drawheight = size;
			drawwidth = size;
		}

		ctx.drawImage(img, xdraw + (size / 2) - (drawwidth / 2), ydraw, drawwidth, drawheight);

		if (typeInfo.colorEnabled) {
			// Replace white with the custom colour. Could move this to the config if white is desired as a plant colour
			let oldColor = [255, 255, 255];
			let oldColorComp = [0, 0, 0];
			let newColor = result[i].color.match(/[a-f\d]{2}/g).map(x => parseInt(x, 16));
			let newColorComp = newColor.map(x => x ^ 255);

			var imageData = ctx.getImageData(xdraw, ydraw, size, size);
			for (var j = 0; j < imageData.data.length; j += 4) {
				if (compareArray(imageData.data.slice(j, j + 3), oldColor)) {
					imageData.data[j] = newColor[0];
					imageData.data[j + 1] = newColor[1];
					imageData.data[j + 2] = newColor[2];
				} else if (compareArray(imageData.data.slice(j, j + 3), oldColorComp)) {
					imageData.data[j] = newColorComp[0];
					imageData.data[j + 1] = newColorComp[1];
					imageData.data[j + 2] = newColorComp[2];
				}
			}
			ctx.putImageData(imageData, xdraw, ydraw);
		}

		let idText = ctx.measureText(i.toString());
		// console.log(idText)
		ctx.fillStyle = '#010101';
		ctx.fillRect(xdraw + size - idText.width - 2 * boxPadding, ydraw + (size) - idText.actualBoundingBoxAscent - 2 * boxPadding, idText.width + (2 * boxPadding), idText.actualBoundingBoxAscent + (2 * boxPadding));
		ctx.fillStyle = '#ffffff';
		ctx.fillText(i.toString(), xdraw + (size) - boxPadding, ydraw + (size) - boxPadding);

		xdraw += size;
	}

	return canvas;
};

function compareArray(a, b) {
	if (a.length !== b.length) throw new Error('Wrong length, yo');
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

function best_square(w, h, n) {
	var high = Math.max(w, h);
	var low = 0;
	while (Math.abs(high-low) > 0.000001) {
		var mid = (low + high) / 2;
		var midval = Math.floor(w / mid) * Math.floor(h / mid);
		if (midval >= n) low=mid;
		else if (midval < n) high=mid;
	}
	return Math.min(w/Math.floor(w/low), h/Math.floor(h/low));
}
