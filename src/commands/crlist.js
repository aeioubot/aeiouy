const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

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
        const perPage = 5;
        const pages = Math.ceil(reactions.length / perPage);
        
        if (page > pages || page < 1) {
            await interaction.reply('don\'t be silly please pick a number between 1 and ' + pages);
            return;
        }

        const reactionsToDisplay = reactions.slice((page - 1) * perPage, page * perPage);
        
        interaction.reply({
            content: generateMessageContent(page, pages, reactionsToDisplay),
            components: [createActionRow(page, pages)],
            fetchReply: true
        }).then((message) => {
            const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });

            collector.on('collect', i => {
                const page_delta = i.component.customId == 'prev' ? -1 : 1;
                page += page_delta;
                const reactionsToDisplay = reactions.slice((page - 1) * perPage, page * perPage);
                i.update({
                    content: generateMessageContent(page, pages, reactionsToDisplay),
                    components: [createActionRow(page, pages)],
                });
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });
        });
    },
};

function generateMessageContent(page, pages, reactions) {
    return `you are on page ${page} of ${pages}\n${generateReactionList(reactions)}`
}

function generateReactionList(reactions) {
    return '```' + reactions.map(x =>
        `${x.trigger} \n    => ${x.response}`).join('\n') + '```';
}

function createActionRow(page, max_page) {
    return new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('prev')
                .setLabel('previous')
                .setStyle('PRIMARY')
                .setDisabled(page == 1),
            new MessageButton()
                .setCustomId('next')
                .setLabel('next')
                .setStyle('PRIMARY')
                .setDisabled(page == max_page),
        );
}
