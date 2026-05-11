const { Sequelize } = require('sequelize');
const { PermissionFlagsBits } = require('discord.js');

module.exports = async (message) => {
    if (message.author.bot) return;
	try {
    if (!message.channel.permissionsFor(message.client.user).has(PermissionFlagsBits.SendMessages)) return;
	} catch(e) {}
    const reactionModel = message.client.database.models.reaction;

    const sfw_channel = message.channel.nsfw === false;

    let query = `((trigger LIKE :content and type = 'full') or (:content like '%' || trigger || '%' and type = 'partial')) and guild = :guild and is_template = 0`

    if (sfw_channel) {
        query += ` and is_nsfw = 0`
    }

    const reactions = await reactionModel.findAll({
        where: Sequelize.literal(query),
        replacements: {
            content: message.content,
            guild: message.guild.id,
        }
    })

    if (reactions.length > 0) {

        // pick random reaction
        const reaction = reactions[Math.floor(Math.random() * reactions.length)];

        if (reaction.is_emoji) {
            message.react(reaction.response);
        }
        else {
            message.channel.send(reaction.response);
        }
    }
    else {
        let query = {
            guild: message.guild.id,
            is_template: 1,
        }

        if (sfw_channel) {
            query.is_nsfw = 0;
        }
        
        const template_reactions = await reactionModel.findAll({
            where: query
        });

        if (template_reactions.length === 0) return;

        // Test each regex, if one matches, take the response, replace {1} with the first match, etc, then send it
        for (const template_reaction of template_reactions) {
            // Prevent catastrophic backtracking (todo: stop this at the source in /cradd)
            if (template_reaction.trigger_regex.includes('(.+) (.+)') || template_reaction.trigger_regex.includes('(.+)(.+)')) continue;
            const regex = new RegExp(template_reaction.trigger_regex, 'i');
            const match = message.content.match(regex);
            if (match) {
                // Find all responses that use the same trigger
                const matching_reactions = template_reactions.filter(reaction => reaction.trigger === template_reaction.trigger);

                // Pick a random one
                const reaction = matching_reactions[Math.floor(Math.random() * matching_reactions.length)];

                if (reaction.is_emoji) {
                    message.react(reaction.response);
                    return;
                }

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
