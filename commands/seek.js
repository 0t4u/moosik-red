const { MessageEmbed } = require("discord.js")
const { formatTime } = require("../func.js")
exports.run = async (client, message, args) => {
    const player = client.music.playerCollection.get(message.guild.id);
    if (!player || !player.playing) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Nothing is playing in this server.')
        .setTimestamp()
    );
    function toMs(time) {
        const st = time.split(':')
        let t
        if (st[0] && st[1] && st[2]) {
            t = (st[2] * 1000) + (st[1] * 60 * 1000) + (st[0] * 60 * 60 * 1000)
        } else if (st[0] && st[1] && !st[2]) {
            t = (st[1] * 1000) + (st[0] * 60 * 1000)
        } else if (st[0] && !st[1] && !st[2]) {
            t = (st[0] * 1000)
        }
        return t
    }
    function ArgsDisp(time) {
        const st = time.split(':')
        if (st[2]) {
            return `${st[0]}h, ${st[1]}m, ${st[2]}s`
        } else if (st[1]) {
            return `${st[0]}m, ${st[1]}s`
        } else if (st[0]) {
            return `${st[0]}s`
        }
    }
    if (!args || !args[0]) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription(`Please provide a time in the format of \`Hour:Minute:Second\` and between \`${formatTime(player.queue.first.length)}\``)
        .setTimestamp()
    );
    if (isNaN(toMs(args[0])) || toMs(args[0]) > player.queue.first.length || toMs(args[0]) < 0 ) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription(`Time must be a time in the format of \`Hour:Minute:Second\` and between \`${formatTime(player.queue.first.length)}\``)
        .setTimestamp()
    );
    player.seek(toMs(args[0]));
    message.channel.send(
        new MessageEmbed()
        .setColor('BLUE')
        .setAuthor('Seeked:')
        .setTitle('Track Seeked')
        .setDescription(
            `Track seeked to ${ArgsDisp(args[0])}\nSong may take a while to play`
        )
    )
}
