class GatewayCommand {
    constructor({name, payload, targets, source}) {
        this.name = name;
        this.payload = payload;
        this.targets = targets;
        this.time = time = new Date().getTime().toString();
        this.source = source;
    }
}

module.exports = GatewayCommand;
