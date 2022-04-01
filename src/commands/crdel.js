const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
	.setName('crdel')
	.setDescription('Delete a custom reaction')
	.addStringOption(option =>
		option.setName('trigger')
			.setDescription('Thing the user says')
			.setRequired(true))
    .addStringOption(option =>
        option.setName('response')
            .setDescription('Thing aeiou replies')
            .setRequired(false)),
    help: `Use this command to delete a custom reaction. You have to specify the trigger of the reaction you want to delete.
If there are multiple reactions with the same trigger, specify the one you want by also including the response.`,
    async execute(interaction) {
        console.log(interaction.client.database.models.reaction);
        // TODO validation ? max len
        const reactionModel = interaction.client.database.models.reaction;
        const criteria = {};
        criteria.trigger = interaction.options.getString('trigger');
        if (interaction.options.getString('response'))
            criteria.response = interaction.options.getString('response');
        criteria.guild = interaction.guild.id;

        const reactions = await reactionModel.findAll({ where: criteria});

        if (reactions.length === 0) {
            await interaction.reply(`i couldn't find that one.`);
        }
        else if (reactions.length === 1) {
            await reactions[0].destroy();
            await interaction.reply(`ok, I deleted the reaction for \`${reactions[0].trigger}\`.`);
        }
        else {
            await interaction.reply('multiple reactions found. please specify which one you want to delete by also entering the corresponding response.');
        }
    },
};
