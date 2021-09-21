const { MessageEmbed } = require("discord.js")
exports.run = async (client, message, args) => {
    const player = client.music.playerCollection.get(message.guild.id);
    if (!player) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Nothing is playing in this server.')
        .setTimestamp()
    );
    if (player.options.autoNextYT) {
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Please disable Auto Next (Youtube) to use loop.')
        .setTimestamp() 
    }
    if (!args || !args[0] || !args[1]) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Please provide a range of positions in queue to wipe in the following format: `<range start> <range end>`')
        .setTimestamp()
    );
    const from = args[0]
    const to = args[1]
    if (from > to) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Start parameter must be smaller than end paramater.')
        .setTimestamp()
    );
    if (to > player.queue.size) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('End parameter must be smaller or equal to queue size.')
        .setTimestamp()
    );
    player.queue.wipe(from, to)
    message.channel.send(
        new MessageEmbed()
        .setColor('BLUE')
        .setAuthor('Wipe queue:')
        .setTitle('Songs wiped')
        .setDescription(
            `Tracks from ${from} to ${to} wiped`
        )
    )
}