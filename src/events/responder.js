const { Sequelize } = require('sequelize');

module.exports = async (message) => {
    if (message.author.bot) return;
    const reactionModel = message.client.database.models.reaction;

    const reactions = await reactionModel.findAll({
        where: Sequelize.literal(
            `((trigger = :content and type = 'full') or (:content like '%' || trigger || '%' and type = 'partial')) and guild = :guild`),
        replacements: {
            content: message.content,
            guild: message.guild.id,
        }
    })

    if (reactions.length === 0) return

    // pick random reaction
    const reaction = reactions[Math.floor(Math.random() * reactions.length)];

    message.channel.send(reaction.response);
}
