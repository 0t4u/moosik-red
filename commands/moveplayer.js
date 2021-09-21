const { MessageEmbed } = require("discord.js")

exports.aliases = ["mvplayer"]
exports.run = async (client, message, args) => {
    const player = client.music.playerCollection.get(message.guild.id);
    if (!player || !player.playing) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Nothing is playing in this server.')
        .setTimestamp()
    );
    if (!args) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Please provide a valid channel name or id (missing arguments)')
        .setTimestamp()
    );
    const to = message.guild.channels.cache.get(args) || message.guild.channels.cache.find((c) => c.name.toLowerCase() === args.join(' ').toLowerCase());
    if (!to) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Please provide a valid channel name or id')
        .setTimestamp()
    );
    player.movePlayer(to)
    message.channel.send(
        new MessageEmbed()
        .setColor('BLUE')
        .setAuthor('Moved:')
        .setTitle('Player moved')
        .setDescription(
            `Player channel moved to ${to.name}\nMusic may take a while to resume playing`
        )
    )
};
