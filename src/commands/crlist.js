const { SlashCommandBuilder } = require('@discordjs/builders');

const { generateMessageObject } = require('../shared/list.js')

const PAGE_SIZE = 4;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crlist')
        .setDescription('List Custom Reactions in this server')
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('Page number')
                .setRequired(false)),
    help: 'List custom reactions in the server. You can click the buttons to navigate between pages, or jump to a specific page with /crlist <page>.',
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

        // Auto correct invalid page numbers
        page = Math.max(1, page)
        page = Math.min(pages, page)

        const reactionsToDisplay = reactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

        interaction.reply({
            fetchReply: true,
            ...generateMessageObject(page, pages, reactionsToDisplay, PAGE_SIZE)
        }).then((message) => {
            const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 600000 });

            collector.on('collect', i => {
                const page_delta = i.component.customId == 'prev' ? -1 : 1;
                page += page_delta;
                const reactionsToDisplay = reactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
                i.update({
                    ...generateMessageObject(page, pages, reactionsToDisplay, PAGE_SIZE)
                });
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });
        });
    },
};
