const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
	.setName('deleteallcustomreactions')
	.setDescription('Delete ALL custom reactions!')
	.addStringOption(option =>
		option.setName('areyousure')
			.setDescription('are you REALLY REALLY SURE')
			.setRequired(false)),
    help: `delete ALL custom reactions! this can't be undone!!!`,

    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            interaction.reply('Only administrators can do that!');
            return;
        }

        if (interaction.options.getString('areyousure')?.toLowerCase() !== 'yes i am really really sure') {
            await interaction.reply(`if you are __really__ ***really*** sure you want to __***irreversably***__ delete __***ALL***__ custom reactions, please set the "areyousure" option to "yes i am really really sure".`);
            return;
        }

        const reactionModel = interaction.client.database.models.reaction;
        const deleted = await reactionModel.destroy({
            where: {
                guild: interaction.guild.id,
            },
        });

        const words = ['obliterated', 'vaporised', 'sublimated', 'exploded', 'defenestrated'];
		const word = words[Math.floor(words.length * Math.random())];
        await interaction.reply(`${word} ${deleted} custom reactions.`);
    },
};
