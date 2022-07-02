const { Sequelize } = require('sequelize');

module.exports = async (message) => {
    if (message.author.bot) return;
    if (!message.channel.permissionsFor(message.client.user).has('SEND_MESSAGES')) return;

    const reactionModel = message.client.database.models.reaction;

    const reactions = await reactionModel.findAll({
        where: Sequelize.literal(
            `((trigger = :content and type = 'full') or (:content like '%' || trigger || '%' and type = 'partial')) and guild = :guild and is_template = 0`),
        replacements: {
            content: message.content,
            guild: message.guild.id,
        }
    })

    if (reactions.length > 0) {

        // pick random reaction
        const reaction = reactions[Math.floor(Math.random() * reactions.length)];

        message.channel.send(reaction.response);
    }
    else {
        const template_reactions = await reactionModel.findAll({
            where: {
                guild: message.guild.id,
                is_template: 1,
            }
        });

        if (template_reactions.length === 0) return;

        // Test each regex, if one matches, take the response, replace {1} with the first match, etc, then send it
        for (const template_reaction of template_reactions) {
            const regex = new RegExp(template_reaction.trigger_regex, 'i');
            const match = message.content.match(regex);
            if (match) {
                // Find all responses that use the same trigger
                const matching_reactions = template_reactions.filter(reaction => reaction.trigger === template_reaction.trigger);

                // Pick a random one
                const reaction = matching_reactions[Math.floor(Math.random() * matching_reactions.length)];

                let response = reaction.response;
                for (let i = 0; i < match.length; i++) {
                    response = response.replaceAll(`{${i + 1}}`, match[i + 1]);
                }
                
                if (response.length > 2000) return;

                message.channel.send(response);
                return;
            }
        }
    }
}
