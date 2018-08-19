class GatewayCommand {
    constructor({name, payload, targets, time = new Date().getTime().toString(), source}) {
        this.gateway = true;
        this.name = name;
        this.payload = payload;
        this.targets = targets;
        this.time = time;
        this.source = source;
    }
}

module.exports = GatewayCommand;
