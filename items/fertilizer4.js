module.exports = ({msg, args, client}) => {
    client.mods.plant.findOne({where: {id: args.extra}}).then(plant => {
        client.utils.growPlants([plant], {bonus: 80}, (grownPlants) => {
            client.utils.generatePlantEmbed(grownPlants[0], client, ['server']).then(embed => {
                return msg.say('You\'ve fertilized your plant and it has grown 80%!', embed)
            })
        });
    })
}