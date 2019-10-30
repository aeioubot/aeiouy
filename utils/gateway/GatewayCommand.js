class GatewayCommand {
	constructor({client, name, payload, targets, time}) {
		this.name = name;
		this.payload = payload;
		this.targets = targets;
		this.time = time || new Date().getTime().toString();
		this.source = client.shard.id;
		this.gateway = true;
		this.totalDestinations = !targets || targets.length === 0 ? client.shard.count : targets.length;
	}
}

module.exports = GatewayCommand;
