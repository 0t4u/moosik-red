const { MessageEmbed, MessageAttachment } = require('discord.js')
const { formatTime } = require('../func.js')

exports.aliases = ["q"]
exports.run = async (client, message, args) => {
    const player = client.music.playerCollection.get(message.guild.id);
    if (!player) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Nothing is playing in this server.')
        .setTimestamp()
    );
    let loopState
    if (player.queue.repeatTrack) {
      loopState = '🔂Track'
    } else if (player.queue.repeatQueue) {
      loopState = '🔁Queue'
    } else {
      loopState = '🔀Normal'
    }
    let volState;
    if (player.volume > 80) {
      volState = `🔊`
    } else if (player.volume <= 80 && player.volume > 45) {
      volState = `🔉`
    } else if (player.volume > 0 && player.volume <=45) { 
      volState = `🔈`
    } else if (!player.volume) {
      volState = `🔇`
    }
    if (!args[0]) {
        let currentPage = 0
        const qEmbeds = queueEmbedGen()

        const queueEmbed = await message.channel.send(
            `**Current Page** - *${currentPage + 1}* out of *${qEmbeds.length}*`,
            qEmbeds[currentPage]
        );

        try {
            await queueEmbed.react("◀️");
            await queueEmbed.react("⏹");
            await queueEmbed.react("▶️");
        } catch (error) {
            message.channel.send(
                new MessageEmbed()
                .setColor('RED')
                .setTitle('Error')
                .setDescription('Reactions Failed on Interactive Queue Embed.')
                .setTimestamp()
            )
        }

        const filter = (reaction, user) =>
        ["◀️", "⏹", "▶️"].includes(reaction.emoji.name) && message.author.id === user.id;
        const collector = queueEmbed.createReactionCollector(filter, { time: 60000, dispose: true });
        collector.on("collect", async (reaction, user) => {
            try{
                if (reaction.emoji.name === "▶️") {
                    if (currentPage < qEmbeds.length - 1) {
                        currentPage++;
                        queueEmbed.edit(`**Current Page** - *${currentPage + 1}* out of *${qEmbeds.length}*`,
                        qEmbeds[currentPage]
                        )
                    }
                } else if (reaction.emoji.name === "◀️") {
                    if (currentPage !== 0) {
                        --currentPage;
                        queueEmbed.edit(`**Current Page** - *${currentPage + 1}* out of *${qEmbeds.length}*`,
                        qEmbeds[currentPage]
                        )
                    }
                } else {
                    collector.stop();
                    reaction.message.reactions.removeAll();
                }
                await reaction.users.remove(message.author.id);
            } catch (error) {
                return message.channel.send(
                    new MessageEmbed()
                    .setColor('RED')
                    .setTitle('Error')
                    .setDescription('Reaction Collector errored on Interactive Queue Embed.')
                    .setTimestamp()
                )
            }
        });
        function queueEmbedGen() {
            let embeds = [];
            let k = 5 + 1;
            for (let i = 0; i < player.queue.size; i += 5) {
                let j = i + 1
                let qDat = [];
                for ([ key, val ] of player.queue.KVArray().slice(i + 1, k)) {
                    const { title, length, uri, author, user } = val;
                    k += 5;
                    let genamt = 0;
                    genamt++;
                    for (let qi = 0; qi < genamt; qi++) {
                        qDat.push(`[**${++j}**] (${key}) [${title}](${uri}) by ${author} • ${formatTime(length)} - Requested by: ${user}`/*\n`*/)
                    }
                }
                const embed = new MessageEmbed()
                .setColor('BLUE')
                .setTitle('Queue')
                .setDescription(`**Current Song - [${player.queue.first.title}](${player.queue.first.uri}) by ${player.queue.first.author} • ${formatTime(player.queue.first.length)} - Requested by: ${player.queue.first.user}**`/* \n\n${qDat.trim()}`*/)
                .setFooter(`${loopState} • ${volState}${player.volume} • ${player.queue.size} tracks • Duration: ${formatTime(player.queue.duration)}`)
                .setTimestamp();
                for(f = 0; f < 4; f++){
                    if(qDat[f]) embed.addField('\u200B', qDat[f])
                }
                embeds.push(embed);
            }
            return embeds;
        }
    }
}
