module.exports = function(name) {
	const colours = {
		black: '\x1b[30m',
		red: '\x1b[31m',
		green: '\x1b[32m',
		yellow: '\x1b[33m',
		blue: '\x1b[34m',
		magenta: '\x1b[35m',
		cyan: '\x1b[36m',
		white: '\x1b[37m',
		reset: '\x1b[0m',
		r: '\x1b[0m',
	};
	const oldLog = console.log;
	console.log = (...args) => {
		console.write(   '{cyan}info  |', ...args);
	};
	console.error = (...args) => {
		console.write(    '{red}err   |', ...args);
	};
	console.warn = (...args) => {
		console.write( '{yellow}warn  |', ...args);
	};
	console.fatal = (...args) => {
		console.write('{magenta}fatal |', ...args);
		process.exit(0);
	};
	console.write = (...args) => {
		args = args.map((arg) => {
			if (typeof arg === 'string') {
				Object.keys(colours).forEach((colour) => {
					arg = arg.replace(`{${colour}}`, colours[colour]);
				});
				arg += colours.reset;
			}
			return arg;
		});
		oldLog(`${colours.cyan}[${name}] ${colours.reset}` + new Date().toISOString().replace('T', ' ').replace('Z', ''), ...args);
	};
};
