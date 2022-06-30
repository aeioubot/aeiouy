const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('support')
		.setDescription('Get an invite to aeiou\'s support server'),
	help: 'There\'s not much to explain here, if you use this command you\'ll get an invite to the Discord server where you can get support.',
	async execute(interaction) {
        await interaction.reply({ content: `Support server invite: https://discord.gg/vPAzdzW
Feel free to ping zaop#0003 if you need help.`, ephemeral: true })
	},
};
