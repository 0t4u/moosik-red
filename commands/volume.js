const { MessageEmbed } = require("discord.js")

exports.aliases = ["vol"]
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
    if (!args[0]) 
        return message.channel.send(
            new MessageEmbed()
            .setColor('BLUE')
            .setAuthor('Check volume:')
            .setTitle('Volume')
            .setDescription(`Volume is currently \`${player.volume}\``)
            .setTimestamp()
        );
    if (isNaN(args[0]) || parseInt(args[0]) > 200 || parseInt(args[0]) < 0)
		return message.channel.send(
            new MessageEmbed()
            .setColor('RED')
            .setTitle('Error')
            .setDescription('Volume must be a number between `0` and `200`.\n Warning: any volume above 100 may cause ear or brain damage so use at your own risk')
            .setTimestamp()
        );
    player.setVolume(parseInt(args[0]));
    message.channel.send(
        new MessageEmbed()
        .setColor('BLUE')
        .setAuthor('Change volume:')
        .setTitle('Volume set')
        .setDescription(`Volume set to: \`${player.volume}\`.`)
        .setTimestamp()
    );
}