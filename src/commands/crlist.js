const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

const PAGE_SIZE = 4;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crlist')
        .setDescription('List Custom Reactions in this server')
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('Page number')
                .setRequired(false)),
    async execute(interaction) {
        const reactionModel = interaction.client.database.models.reaction;
        const reactions = await reactionModel.findAll({
            where: {
                guild: interaction.guild.id,
            },
        });
        let page = interaction.options.getInteger('page') || 1;

        const pages = Math.ceil(reactions.length / PAGE_SIZE);

        if (pages == 0) {
            interaction.respond('No custom reactions found');
            return;
        }
        if (page < 1) {
            await interaction.reply('don\'t be silly please pick a number between 1 and ' + pages);
            return;
        }
        if (page > pages) page = pages;

        const reactionsToDisplay = reactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

        interaction.reply({
            fetchReply: true,
            ...generateMessageObject(page, pages, reactionsToDisplay)
        }).then((message) => {
            const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 600000 });

            collector.on('collect', i => {
                const page_delta = i.component.customId == 'prev' ? -1 : 1;
                page += page_delta;
                const reactionsToDisplay = reactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
                i.update({
                    ...generateMessageObject(page, pages, reactionsToDisplay)
                });
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });
        });
    },
};

function generateMessageObject(page, pages, reactions) {
    return {
        content: generateMessageContent(page, pages) + '\n' + generateReactionList(reactions, page),
        components: [createActionRow(page, pages)],
    }
}

function generateMessageContent(page, pages) {
    return `you are on page ${page} of ${pages}`
}

function generateReactionList(reactions, page) {
    return reactions.map((x, i) => {
        const number_text = ((i + (page - 1) * PAGE_SIZE + 1).toString() + '.').padEnd(4)
        const partial_text = x.type == 'partial' ? ' _(partial match)_' : '';
        const template_text = x.is_template ? ' _(template)_' : '';
        return `\`${number_text}\` \`${x.trigger}\`${partial_text}${template_text}\n\`  ->\` \`${x.response}\``
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
