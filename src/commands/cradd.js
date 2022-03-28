const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
	.setName('cradd')
	.setDescription('Add a new custom reaction')
	.addStringOption(option =>
		option.setName('trigger')
			.setDescription('Thing the user says')
			.setRequired(true))
    .addStringOption(option =>
        option.setName('response')
            .setDescription('Thing aeiou replies')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('type')
            .setDescription('Matching method')
            .setRequired(false)
            .addChoice('Full message', 'full')
            .addChoice('Part of message', 'partial')
            .addChoice('Template', 'template')),
    async execute(interaction) {
        console.log(interaction.client.database.models.reaction);
        // TODO validation ? max len
        const reactionModel = interaction.client.database.models.reaction;
        const reaction = await reactionModel.create({
            trigger: interaction.options.getString('trigger'),
            response: interaction.options.getString('response'),
            type: interaction.options.getString('type') || 'full',
            guild: interaction.guild.id,
        });
        await interaction.reply(`Sure, when you say **${reaction.trigger}**, I'll respond with **${reaction.response}**.`);
    },
};
