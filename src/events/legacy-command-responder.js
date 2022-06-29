module.exports = async (message) => {
    if (message.author.bot) return;
    // if a message starts with !cradd, !crlist, !crdel, !crfind, respond that aeiou now uses slash commands
    if (message.content.startsWith('!cradd') || message.content.startsWith('!crlist') || message.content.startsWith('!crdel') || message.content.startsWith('!crfind')) {
        message.channel.send(`Aeiou now uses slash commands, and the old \`!\` prefix is no longer supported. You can use \`/help <command>\` to view detailed usage info.
For more information, see: <https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ>
You can also join the support server if you need assistance (\`/help\` for the invite).`);
        return;
    }
}
