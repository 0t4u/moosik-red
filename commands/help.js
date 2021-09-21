const { MessageEmbed } = require("discord.js")

exports.aliases = ["h"]
exports.run = async (client, message, args) => {
    message.channel.send(`
    help
loop
move
moveplayer
msg
nowplaying
pause
play
queue
reload
resume
seek
skip
stats
stop
stopbot
volume
wipe
autonextyt
botstats
    `)
}