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
    if (!player.playing) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Nothing being played in this server.')
        .setTimestamp()
    );
    if (!player.paused) await player.pause()
    message.channel.send(
        new MessageEmbed()
        .setColor('BLUE')
        .setAuthor('Player paused:')
        .setTitle('Paused')
        .setDescription(`Pause set to: \`${player.paused}\`!`)
        .setTimestamp()
    );
}