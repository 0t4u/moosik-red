const { MessageEmbed } = require("discord.js")

exports.aliases = ["mv"]
exports.run = async (client, message, args) => {
    const player = client.music.playerCollection.get(message.guild.id);
    if (!player) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Nothing is playing in this server.')
        .setTimestamp()
    );
    if (!args || !args[0] || !args[1]) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Please provide a position and a new position in the following format: `<postiton 1> <position 2>`')
        .setTimestamp()
    );
    const from = args[0]
    const to = args[1]
    player.queue.moveTrack(from, to)
    message.channel.send(
        new MessageEmbed()
        .setColor('BLUE')
        .setAuthor('Moved:')
        .setTitle('Songs moved')
        .setDescription(
            `Track moved from ${from} to ${to}`
        )
    )
}