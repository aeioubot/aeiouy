const fs = require('node:fs');

const { SlashCommandBuilder } = require('@discordjs/builders');

const commands = [];
const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('View the extended description of a command')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command you want info about')
                .setChoices(commandFiles.map(c => [c.slice(0, -3), c.slice(0, -3)]))
                .setRequired(false)),
    help: 'Use this command to view detailed usage information about a command.',
    async execute(interaction) {
        const command = interaction.options.getString('command');
        if (!command) {
            await interaction.reply(`Hi! I'm aeiou, and I can respond to messages with custom reactions. Try \`/help cradd\` to get started!
If you need help, you can also join the support server: https://discord.gg/vPAzdzW`);
            return;
        }
        const command_file = `${__dirname}/${command}.js`;
        if (!fs.existsSync(command_file)) {
            await interaction.reply(`i couldn't find that one.`);
            return;
        }
        const command_module = require(command_file);
        const help_text = command_module.help || '_No extended description available._';
        await interaction.reply(`**${command_module.data.name}:** ${command_module.data.description}\n${help_text}`);
    },
};

for (const file of commandFiles) {
    let command;
    if (file == 'help.js')
        command = module.exports;
    else
        command = require(`./${file}`);
    commands.push(command);
}
