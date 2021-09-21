const { MessageEmbed } = require("discord.js")

exports.aliases = ["s"]
exports.run = async (client, message, args) => {
    const player = client.music.playerCollection.get(message.guild.id);
    if (!player) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Nothing is playing in this server.')
        .setTimestamp()
    );
    /*if (player.queue.size === 1) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('No more tracks in queue.')
        .setTimestamp()
    );*/
    if (!args[0]) {
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
        await player.play()
    } else if (args[0]) {
        if (isNaN(args[0])) {
            await player.play()
        } else {
            if (player.queue.size <= args[0]) {
                
            }
        }
    }
}