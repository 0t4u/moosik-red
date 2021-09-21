const os = require('os');
const cpuStat = require('cpu-stat');
const Discord = require('discord.js')
exports.run = async (client, message, args) => { 
    cpuStat.usagePercent(function (error, percent) {
        if (error) {
          return console.error(error)
        }
        message.channel.send({embed: { title: '🕘 Fetching Stats...'}}).then(m => {
            const cores = os.cpus().length //CPU cores.
            const cpuModel = os.cpus()[0].model //CPU model.
            const avgClockMHZ = cpuStat.avgClockMHz();
            const platform = os.platform(); //Platform
            const guilds = client.guilds.cache.size
            const users = client.users.cache.size
            const channels = client.channels.cache.size
            const usage = formatBytes(process.memoryUsage().heapUsed) //MEM usage.
            const Node = process.version //NodeJS version.
            const CPU = percent.toFixed(2) //CPU usage.

            const statEmbed = new Discord.MessageEmbed()
                .setTitle('🤖 Bot Stats')
                .setDescription(`**Bot**\nServers: ${guilds} \nUsers: ${users} \nChannels: ${channels} \n**Server** \nCPU: ${cores} core - ${cpuModel} \nCPU Usage: ${CPU}%\n Average CPU Clock: ${avgClockMHZ}MHZ \nRAM Usage: ${usage}\nNode Version: ${Node}\nDiscordJS Version: ${require('../package.json').dependencies['discord.js']}`)
                .setTimestamp()
                .setFooter(`© ${message.guild.me.displayName}`, client.user.displayAvatarURL());
            m.edit(statEmbed)
        })
    })
}
function formatBytes (a, b) {
    if (0 == a) return "0 Bytes";
    let c = 1024,
        d = b || 2,
        e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        f = Math.floor(Math.log(a) / Math.log(c));
    
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}