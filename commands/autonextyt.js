const { MessageEmbed } = require("discord.js")

exports.aliases = ["autoyt", "autonext"]
exports.run = async (client, message, args) => {
    const player = client.music.playerCollection.get(message.guild.id);
    if (!player) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Nothing is playing in this server.')
        .setTimestamp()
    );
    if (!player.queue.first.uri.includes('youtube')) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('You need to be playing a track from Youtube in order to use this feature.')
        .setTimestamp()
    );
    let status
    if (player.queue.autoNextYT) {
      status = 'enabled'
    } else  {
      status = 'disabled'
    }
    let ops
    if(!args[0]) {
        return message.channel.send(
            new MessageEmbed()
            .setColor('BLUE')
            .setTitle('Loop: ')
            .setDescription(
                `Auto Next (Youtube) is currently \`${status}\`.
Arguments can be \`enable\` or \`disable\`.`
            )
            .setTimestamp()
        );
    } else if (args[0].toLowerCase() === 'enable' || args[0].toLowerCase() === 'on') {
        ops = true
    } else if (args[0].toLowerCase() === 'disable' || args[0].toLowerCase() === 'off') {
        ops = false
    } else {
        return message.channel.send(
            new MessageEmbed()
            .setColor('RED')
            .setTitle('Error')
            .setDescription('Invalid type. Arguments can be `enable`, or `disable`.')
            .setTimestamp()
        )
    }
    let state = ops ? player.queue.toggleAutoNextYT(ops) : player.queue.toggleAutoNextYT(false);

    state;
    if (ops === true && !player.queue.autoNextYT) {
        player.queue.toggleRepeat();
        player.queue.clearQueue();
    }

    message.channel.send(
        new MessageEmbed()
        .setColor('BLUE')
        .setTitle('Auto Next:')
        .setDescription(
            `${ops ? 'Enabled' : 'Disabled'} Auto Next (Youtube)!`
        )
        .setTimestamp()
    )
}
