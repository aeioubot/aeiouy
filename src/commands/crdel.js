const { SlashCommandBuilder, PermissionFlagsBits, ComponentType } = require('discord.js');
const { generateMessageObject } = require('../shared/list.js')
const PAGE_SIZE = 10;
module.exports = {
    data: new SlashCommandBuilder()
	.setName('crdel')
	.setDescription('Delete a custom reaction')
	.addStringOption(option =>
		option.setName('trigger')
			.setDescription('Thing the user says')
			.setRequired(false))
        .addStringOption(option =>
            option.setName('response')
                .setDescription('Thing aeiou replies')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('id')
                .setDescription('reaction ID (starts with CR)')
                .setRequired(false)),
    help: `Use this command to delete a custom reaction. You have to specify the trigger of the reaction you want to delete.
If there are multiple reactions with the same trigger, specify the one you want by also including the response, or refer to it by ID (which you can find via this command or \`/crfind\`)`,
    async execute(interaction) {
        
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            interaction.reply('You do not have permission to add custom reactions (you need the "Manage Messages" permission)');
            return;
        }
        
        // TODO validation ? max len
        const reactionModel = interaction.client.database.models.reaction;
        const criteria = {};
        if (interaction.options.getString('trigger'))
            criteria.trigger = interaction.options.getString('trigger');
        if (interaction.options.getString('response'))
            criteria.response = interaction.options.getString('response');
        if (interaction.options.getString('id')) {
            let id = interaction.options.getString('id');
            if (id.indexOf('CR') != 0) {
                return await interaction.reply('That is not a valid ID, it should start with CR, find it using /crfind or /crdel.')
            }
            criteria.id = id.substring(2);
        }
        if (!criteria.trigger && !criteria.response && !criteria.id) {
            return await interaction.reply('You need to specify the trigger, response, or ID of the reaction you want to delete.')
        }
        criteria.guild = interaction.guild.id;

        const reactions = await reactionModel.findAll({ where: criteria});

        if (reactions.length === 0) {
            await interaction.reply(`i couldn't find that one. Either it doesn't exist or it's not owned by this server.`);
        }
        else if (reactions.length === 1) {
            await reactions[0].destroy();
            await interaction.reply(`ok, I deleted the reaction for \`${reactions[0].trigger}\`.`);
        }
        else {
            const explanation = 'multiple reactions found. try deleting the one you want by specifying the response, or using the id (e.g. `/crdel id:CR23770`).\n\n'
            let page = 1;
            const pages = Math.ceil(reactions.length / PAGE_SIZE);
            const reactionsToDisplay = reactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

            interaction.reply({
                fetchReply: true,
                ...generateMessageObject(page, pages, reactionsToDisplay, PAGE_SIZE, true, explanation)
            }).then((message) => {
                const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 600000 });
    
                collector.on('collect', i => {
                    const page_delta = i.component.customId == 'prev' ? -1 : 1;
                    page += page_delta;
                    const reactionsToDisplay = reactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
                    i.update({
                        ...generateMessageObject(page, pages, reactionsToDisplay, PAGE_SIZE, true, explanation)
                    });
                });
    
                collector.on('end', collected => {
                    console.log(`Collected ${collected.size} interactions.`);
                });
            });

            
            // let txt = generateReactionList(reactions, 1, 20, true);
            // await interaction.reply(txt + '\n\n');
        }
    },
};
