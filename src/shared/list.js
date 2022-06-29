const { MessageActionRow, MessageButton } = require('discord.js');

function generateMessageObject(page, pages, reactions, page_size) {

    return {
        content: generateMessageContent(page, pages) + '\n' + generateReactionList(reactions, page, page_size),
        components: pages > 1 ? [createActionRow(page, pages)] : [],
    }
}

function generateMessageContent(page, pages) {
    if (pages == 1) return ''
    
    return `you are on page ${page} of ${pages}`
}

function generateReactionList(reactions, page, page_size) {
    return reactions.map((x, i) => {
        const number_text = ((i + (page - 1) * page_size + 1).toString() + '.').padEnd(5)
        const partial_text = x.type == 'partial' ? ' _(partial match)_' : '';
        const template_text = x.is_template ? ' _(template)_' : '';
        return `\`${number_text}\` \`${x.trigger}\`${partial_text}${template_text}\n\`   ->\` \`${x.response}\``
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

module.exports = { generateMessageObject }
