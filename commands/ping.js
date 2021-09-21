const { MessageEmbed } = require("discord.js")
exports.run = async (client, message, args) => {
    message.channel.send({embed: { title: '🕘 Pinging...'}}).then(m => {
        const statEmbed = new MessageEmbed()
        .setTitle(':ping_pong: Pong!')
        .setDescription(`\nHeartbeat :heart: \`${client.ws.ping}\`\n\nRecieve :speech_balloon: \`${Date.now() - m.createdTimestamp}\`\n\nSend :hourglass: \`${Date.now() - message.createdTimestamp}\`\n`)
        .setTimestamp()
        .setFooter(`© ${message.guild.me.displayName}`, client.user.displayAvatarURL());
    m.edit(statEmbed)
    })
}