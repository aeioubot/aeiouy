const { MessageActionRow, MessageButton } = require('discord.js');

function generateMessageObject(page, pages, reactions, page_size, use_ids = false, prefix='') {

    return {
        content: prefix + generateMessageContent(page, pages) + '\n' + generateReactionList(reactions, page, page_size, use_ids),
        components: pages > 1 ? [createActionRow(page, pages)] : [],
    }
}

function generateMessageContent(page, pages) {
    if (pages == 1) return 'here are all the results'
    
    return `you are on page ${page} of ${pages}`
}

function generateReactionList(reactions, page, page_size, use_ids = false) {
    return reactions.map((x, i) => {
        let number_text;
        if (use_ids) {
            number_text = '[' + ('CR' + x.id.toString() + '').padEnd(7) + ']'
        }
        else {
            number_text = ((i + (page - 1) * page_size + 1).toString() + '.').padEnd(5)
        }
        const partial_text = x.type == 'partial' ? ' _(partial match)_' : '';
        const template_text = x.is_template ? ' _(template)_' : '';
        const nsfw_text = x.is_nsfw ? ' _(nsfw)_' : '';
        const emoji_text = x.is_emoji ? ' _(emoji react)_': '';
        const trigger_text = x.trigger.length > 100 ? x.trigger.slice(0, 100) + '...' : x.trigger;
        const response_text = x.response.length > 100 ? x.response.slice(0, 100) + '...' : x.response;
        return `\`${number_text}\` \`${trigger_text}\`${partial_text}${template_text}${nsfw_text}${emoji_text}\n\`   ->\` \`${response_text}\``
    }).join('\n');
}

function createActionRow(page, max_page) {
    return new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('prev')
                .setLabel('previous page')
                .setStyle('PRIMARY')
                .setDisabled(page == 1),
            new MessageButton()
                .setCustomId('next')
                .setLabel('next page')
                .setStyle('PRIMARY')
                .setDisabled(page == max_page),
        );
}

module.exports = { generateMessageObject, generateReactionList }
