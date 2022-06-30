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
                .addChoice('Part of message', 'partial')),
    help: `Custom reactions have a **trigger** and a **response**. When a user says the trigger, aeiou will respond with the response.
There are two matching methods available: **full message** and **part of message**. The former will match the entire message, while the latter will also match if the trigger is just _contained_ in the message.

The system also supports **template** reactions, which are reactions that contain placeholders. These placeholders can be used to insert values from the message into the response.
For example, with the trigger \`I'm {1}\` and the response \`Hi {1}, I'm aeiou\`, aeiou will respond with \`Hi hungry, I'm aeiou\` when a user says \`I'm hungry\`.
You can also use multiple placeholders; just mark them each with a different number, like \`when the {1} is {2}\`.`,
    async execute(interaction) {
        
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            interaction.reply('You do not have permission to add custom reactions (you need the "Manage Messages" permission)');
            return;
        }

        // TODO validation ? max len

        let trigger = interaction.options.getString('trigger');

        const trigger_is_template = (/\{\d+\}/).test(trigger);

        const object_to_insert = {
            trigger: trigger,
            response: interaction.options.getString('response'),
            type: interaction.options.getString('type') || 'full',
            is_template: trigger_is_template,
            guild: interaction.guild.id,
        }

        if (trigger_is_template) {
            // Example 1
            // input: "{1} and {2} but mostly {1}"
            // output: "(.+) and (.+) but mostly \1"

            // Example 2
            // input: "My name is {1}
            // output: "My name is (.+)"

            // Example 3
            // input: "{1} {1} {1} {1}"
            // output: "(.+) \1 \1 \1"
            let seen = []
            let regex = new RegExp('\\\\{(\\d+)\\\\}', 'g');
            let trigger_regex = trigger.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
            // trigger is changed in the process, and the regex obj keeps track of the last visited position, so we need to keep a copy
            const trigger_copy = trigger_regex
            let match = regex.exec(trigger_copy);
            // for each match
            while (match) {
                if (seen.includes(match[0])) {
                    trigger_regex = trigger_regex.replace(match[0], `\\${match[1]}`);
                }
                else {
                    seen.push(match[0]);
                    trigger_regex = trigger_regex.replace(match[0], `(.+)`);
                }
                match = regex.exec(trigger_copy);
            }

            if (object_to_insert.type == 'full')
                trigger_regex = '^' + trigger_regex + '$';

            object_to_insert.trigger_regex = trigger_regex;
        }

        const reactionModel = interaction.client.database.models.reaction;
        const reaction = await reactionModel.create(object_to_insert);
        await interaction.reply(`Sure, when you say **${interaction.options.getString('trigger')}**, I'll respond with **${reaction.response}**.`);
    },
};
