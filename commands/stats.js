const { MessageEmbed } = require("discord.js")
function duration(ms) {
    const sec = Math.floor((ms / 1000) % 60).toString()
    const min = Math.floor((ms / (1000 * 60)) % 60).toString()
    const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString()
    const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString()
    return ` - Days: \`${days.padStart(1, '0')}\`, \n - Hours: \`${hrs.padStart(2, '0')}\`, \n - Minutes: \`${min.padStart(2, '0')}\`, \n - Seconds: \`${sec.padStart(2, '0')}\`. `
}
function formatBytes (a, b) {
    if (0 == a) return "0 Bytes";
    let c = 1024,
        d = b || 2,
        e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        f = Math.floor(Math.log(a) / Math.log(c));
    
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
  }
exports.run = async (client, message, args) => {
    const contaboNodeStats = client.music.nodeCollection.get('62.171.174.121').systemStats;
    message.channel.send(
        new MessageEmbed()
        .setAuthor('Lavalink Node Information')
        .setTitle('Node Stats')
        .setThumbnail('https://media.discordapp.net/avatars/727510662388908110/a2b05b49164419c52d937197eeb8d655.webp?size=256')
        .setDescription(
            `**DE-01**\nPlaying: \`${contaboNodeStats.playingPlayers}\`\nMemory: \n - Reservable: \`${formatBytes(contaboNodeStats.memory.reservable)}\`\n - Used: \`${formatBytes(contaboNodeStats.memory.used)}\`\n - Free: \`${formatBytes(contaboNodeStats.memory.free)}\`\n - Allocated: \`${formatBytes(contaboNodeStats.memory.allocated)}\`\nPlayers: \`${contaboNodeStats.players}\`\nCPU: \n - Cores: \`${contaboNodeStats.cpu.cores}\`\n - System Load: \`${Math.round(100 * contaboNodeStats.cpu.systemLoad)}%\`\n - Lavalink Load:\`${Math.round(100 * contaboNodeStats.cpu.lavalinkLoad)}%\`\nUptime: \n${duration(contaboNodeStats.uptime)}`
        )
        .setColor('BLUE')
        .setTimestamp()
    )
}