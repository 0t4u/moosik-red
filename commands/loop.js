const { MessageEmbed } = require("discord.js")

exports.aliases = ["repeat"]
exports.run = async (client, message, args) => {
    const player = client.music.playerCollection.get(message.guild.id);
    if (!player) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Nothing is playing in this server.')
        .setTimestamp()
    );
    if (player.queue.autoNextYT) {
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Please disable Auto Next (Youtube) to use loop.')
        .setTimestamp() 
    }
    let loopStatus
    if (player.queue.repeatTrack) {
      loopStatus = 'enabled for track'
    } else if (player.queue.repeatQueue) {
      loopStatus = 'enabled for queue'
    } else  {
      loopStatus = 'disabled'
    }
    let repeatOps
    if(!args[0]) {
        return message.channel.send(
            new MessageEmbed()
            .setColor('BLUE')
            .setTitle('Loop: ')
            .setDescription(
                `Loop is currently \`${loopStatus}\`.
Arguments can be \`track\`, \`queue\`, or \`disable\`.`
            )
            .setTimestamp()
        );
    } else if (args[0].toLowerCase() === 'track' || args[0].toLowerCase() === 'song' || args[0].toLowerCase() === 'one') {
        repeatOps = 'track'
    } else if (args[0].toLowerCase() === 'queue' || args[0].toLowerCase() === 'all') {
        repeatOps = 'queue'
    } else if (args[0].toLowerCase() === 'disable' || args[0].toLowerCase() === 'off') {
        repeatOps = ''
    } else {
        return message.channel.send(
            new MessageEmbed()
            .setColor('RED')
            .setTitle('Error')
            .setDescription('Invalid type. Arguments can be `track`, `queue`, or `disable`.')
            .setTimestamp()
        )
    }
    let state = repeatOps ? player.queue.toggleRepeat(repeatOps) : player.queue.toggleRepeat();

    message.channel.send(
        new MessageEmbed()
        .setColor('BLUE')
        .setTitle('Loop:')
        .setDescription(
            `${state ? 'Enabled' : 'Disabled'} loop for ${repeatOps ? repeatOps : 'track and queue'}!`
        )
        .setTimestamp()
    )
}
