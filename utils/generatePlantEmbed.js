const {RichEmbed} = require('discord.js')

module.exports = (plant) => {
    return new RichEmbed()
    .setTitle(plant.name)
    .setColor('#' + plant.colour)
    .setDescription(plant.lastEvent)
    .addField(
        'Watered',
        plant.watered,
        true,
    )
    .addField(
        'Progress',
        plant.progress,
        true,
    );
}