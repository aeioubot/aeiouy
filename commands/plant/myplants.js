const commando = require('discord.js-commando');
const Canvas = require('canvas');
const { Attachment } = require('discord.js');

module.exports = class MyPlantsCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'myplants',
            group: 'plant',
            memberName: 'myplants',
            description: 'Get your plants statuses!',
            aliases: ['my'],
            args: [{
                key: 'action',
                type: 'string',
                oneOf: ['view', 'water', 'harvest'],
                default: 'view',
                prompt: 'action?',
            }, {
                key: 'index',
                type: 'integer',
                default: 0,
                prompt: 'which id?',
            }]
        });
    }

    async run(msg, { action, index }) {
        switch (action) {
            case 'view':
                this.client.mods.user.findOne({ where: { id: msg.author.id } }).then(user => {
                    user.getPlants({ where: { planted: true } }).then(async plants => {
                        if (!plants || plants.length === 0) return msg.say('You don\'t have any plants planted!');

                        if (index) {
                            if (!plants[index]) return msg.say('Index not found');
                            this.client.utils.growPlants([plants[index]], {}, (grownPlants) => {
                                this.client.utils.generatePlantEmbed(grownPlants[0], this.client, ['server']).then(embed => {
                                    return msg.say('here plant', embed)
                                })
                            });
                            
                        }
                        else {

                            this.client.utils.growPlants(plants, {}, async (grownPlants) => {

                                const canvas = await this.client.utils.generatePlantCanvas(grownPlants, this.client.models.plant.types);
                                const attachment = new Attachment(canvas.toBuffer(), 'own-plants.png');
                                return msg.say('Here are your plants', attachment);
                            });



                        }
                    }).catch(e => msg.say('error: ' + e));
                })
                break;
            case 'water':
                this.client.mods.user.findOne({ where: { id: msg.author.id } }).then(user => {
                    user.getPlants({ where: { planted: true } }).then(async plants => {
                        if (!plants[index]) return msg.say('Index not found');
                        plants[index].update({ watered: true })
                        //this.client.models.plant.water(plants[index].id);
                        //let result = this.client.utils.growPlant(plants[index]);
                        //result.watered = true;
                        this.client.utils.generatePlantEmbed(plants[index], this.client).then(embed => {
                            msg.say('Watered!', embed)
                        })
                    }).catch(e => msg.say('error: ' + e));
                })
                /*
                this.client.models.plant.find({ user: msg.author.id, planted: true }).then(async (plants) => {
                    if (!plants[index]) return msg.say('Index not found');
                    this.client.models.plant.water(plants[index].id);
                    let result = this.client.utils.growPlant(plants[index]);
                    result.watered = true;
                    msg.say('watered', this.client.utils.generatePlantEmbed(result));
                    /*
                    const canvas = await this.client.utils.generatePlantCanvas(result, this.client.models.plant.types);
                    const attachment = new Attachment(canvas.toBuffer(), 'welcome-image.png');
        
                    return msg.say('Here are your plants', attachment);
                    result = result[0];
                    result = this.client.utils.growPlant(result);
                    let toSay = '';
                    toSay += 'Here is your current plant.';
                    this.client.utils.generatePlantEmbed(result, this.client).then(embed => {
                        msg.say(toSay, embed);
                    });
                    return null;//*
                }).catch(e => msg.say('error: ' + e));//*/
                break;
        }

    }
};
