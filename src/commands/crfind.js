const { SlashCommandBuilder, ComponentType } = require('discord.js');
const { Op } = require('sequelize');

const { generateMessageObject } = require('../shared/list.js')

const PAGE_SIZE = 10;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crfind')
        .setDescription('Find a custom reaction')
        .addStringOption(option =>
            option.setName('trigger')
                .setDescription('Thing the user says')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('response')
                .setDescription('Thing aeiou replies')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('exact')
                .setDescription('Whether aeiou should only return exact, full matches')
                .setRequired(false)),
    help: `Use this command to find a custom reaction. You can specify the trigger, response, or both.`,
    async execute(interaction) {
        const reactionModel = interaction.client.database.models.reaction;
        const criteria = {};

        let exactMatching = interaction.options.getBoolean('exact');

        if (interaction.options.getString('trigger'))
            criteria.trigger = exactMatching ? interaction.options.getString('trigger') : { [Op.substring]: interaction.options.getString('trigger') };
        if (interaction.options.getString('response'))
            criteria.response = exactMatching ? interaction.options.getString('response') : { [Op.substring]: interaction.options.getString('response') };

        // if neither trigger nor response are specified, return error
        if (!criteria.trigger && !criteria.response) {
            interaction.reply('You need to specify either the trigger or the response.');
            return;
        }
        criteria.guild = interaction.guild.id;

        console.log(criteria)

        const reactions = await reactionModel.findAll({ where: criteria });

        let page = 1;

        const pages = Math.ceil(reactions.length / PAGE_SIZE);

        if (pages == 0) {
            interaction.reply('I couldn\'t find any custom reactions matching these criteria.');
            return;
        }

        const reactionsToDisplay = reactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

        interaction.reply({
            withResponse: true,
            ...generateMessageObject(page, pages, reactionsToDisplay, PAGE_SIZE, true)
        }).then(({ resource }) => {
            const collector = resource.message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 600000 });

            collector.on('collect', i => {
                const page_delta = i.component.customId == 'prev' ? -1 : 1;
                page += page_delta;
                const reactionsToDisplay = reactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
                i.update({
                    ...generateMessageObject(page, pages, reactionsToDisplay, PAGE_SIZE, true)
                });
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });
        });
    },
};
