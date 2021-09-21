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
    player.destroy()
    if (player.interval && player.intervalmsg) {
    clearInterval(player.interval)
    player.intervalmsg.edit(
        new MessageEmbed()
        .setColor('BLUE')
        .setAuthor('Skipped')
        .setTitle(player.queue.first.title)
        .setURL(player.queue.first.uri)
        .setThumbnail(player.queue.first.thumbnail.max)
        .setTimestamp()
        )
        player.interval = null
        player.intervalmsg = null
    }
    message.channel.send(
        new MessageEmbed()
        .setAuthor('Player Destroyed:')
        .setTitle('Stopped')
        .setDescription('Manually stopped. Left voice channel.')
        .setColor('BLUE')
        .setTimestamp()
    )
}