const { MessageEmbed } = require("discord.js")
const { formatTime } = require('../func.js')
const { parse } = require('../watson.js')
const fetch = require('node-fetch')

exports.aliases = ["p"]
exports.run = async (client, message, args, flags) => {
    const vc = message.member.voice.channel;
    if (!vc) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Please join a voice channel before using this command.')
        .setTimestamp()
    );
    //if (client.music.playerCollection.get(message.guild.id)) {
        /*const p = client.music.playerCollection.get(message.guild.id);
        if (p.paused) {
            await message.channel.send(
                new MessageEmbed()
                .setColor('BLUE')
                .setAuthor('Player resumed:')
                .setTitle('Resume')
                .setDescription(`Pause set to: \`false\`!`)
                .setTimestamp()
            ).then(() => {
                p.resume()
            })
        }
        return*/
    if (client.music.playerCollection.get(message.guild.id)) { 
        if (client.music.playerCollection.get(message.guild.id).queue.autoNextYT) return message.channel.send(
            new MessageEmbed()
            .setColor('RED')
            .setTitle('Error')
            .setDescription('Please disable Auto Next (Youtube) play songs.')
            .setTimestamp() 
        );
    }
    //}
    const query = args.join(' ')
    if (!args || args === ' ' || flags[0] === 'sc' && !args || flags[0] === 'sc' && args === []) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Please input a search query or link after the command.')
        .setTimestamp()
    );

    const player = await client.music.spawnPlayer({
        guild: message.guild,
        voiceChannel: vc,
        textChannel: message.channel,
        volume: 100,
        deafen: true
    }, {
        repeatTrack: false,
        repeatQueue: false,
        skipOnError: false
    });1

    let srcflag;
    if (flags[0] === "sc") {
        srcflag = "sc";
    } else {
        srcflag = undefined
    }

    const res = await player.lavaSearch(query, message.member, { source: srcflag ? srcflag : 'yt', add: false }).catch(() => {
        return message.channel.send(
            new MessageEmbed()
            .setColor('RED')
            .setTitle('Error')
            .setDescription('No video(s) or song(s) found.')
            .setTimestamp()
        ).then(() => {
            if (player && !player.playing && !player.paused) { 
                player.destroy()
            } else {
                return
            }
        })
    })
    if(res) {
        if(res.length <= 1) {
            player.queue.add(res[0])
            let ch
            if (res[0].uri.includes('youtube')) {
                const r = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${res[0].identifier}&key=${parse(client.config).ytapikey}`);
                const j = await r.json();
                const q = j.items[0].snippet.channelId
                const l = `https://www.youtube.com/channel/${q}`
                if (q) {
                    ch = `[${res[0].author}](${l})`
                }
            } else {
                ch = res[0].author
            }
            message.channel.send(
                new MessageEmbed()
                .setAuthor('Track added to queue: ')
                .setTitle(res[0].title)
                .setURL(res[0].uri)
                .setDescription(
                    `**Author:** ${ch}\n**Requested By:** ${res[0].user}\n**Lengh:** ${!res[0].length || res[0].length === 9223372036854776000 ? '`🔴LIVE`' : formatTime(res[0].length)}\n**Stream:** ${res[0].isStream}`
                )
                .setThumbnail(res[0].thumbnail.max)
                .setColor('BLUE')
                .setTimestamp()
            )
            if (!player.playing) player.play();
        } else if (res && Array.isArray(res)) {
            let i = 1
            const tracks = res.slice(0, 10)
            const songEmbed = new MessageEmbed()
            .setAuthor(`Select a song:`)
            .setColor('BLUE')
            .setDescription(await /*Promise.all*/(tracks.map(/*async*/ (res) => {
                    /*let ch
                    if (res.uri.includes('youtube')) {
                        const r = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${res.identifier}&key=${parse(client.config).ytapikey}`)
                        const j = await r.json()
                        const q = j.items[0].snippet.channelId
                        const l = `https://www.youtube.com/channel/${q}`
                        if (q) {
                            ch = `[${res.author}](${l})`
                        }
                    } else {
                        ch = res.author
                    }*/
                    return `[**${i++}**] [${res.title}](${res.uri}) by ${/*ch*/res.author} • ${!res.length ? '`🔴LIVE`' : formatTime(res.length)}`
                })))
            .setFooter('Please choose a number. Your response time closes in 20 seconds. Type `cancel` to cancel')
            message.channel.send(songEmbed)
            const collector = message.channel.createMessageCollector(m => {
                return m.author.id === message.author.id && new RegExp(`^([1-9]|10|cancel)$`, "i").test(m.content)
            }, { time: 20000, max: 1})
            collector.on("collect", async m => {
                if (/cancel/i.test(m.content)) return collector.stop("cancelled")
                const track = tracks[Number(m.content) - 1];
                player.queue.add(track)
                if(!player.playing) player.play();
                let ch
                if (track.uri.includes('youtube')) {
                    const r = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${track.identifier}&key=${parse(client.config).ytapikey}`);
                    const j = await r.json();
                    const q = j.items[0].snippet.channelId
                    const l = `https://www.youtube.com/channel/${q}`
                    if (q) {
                        ch = `[${track.author}](${l})`
                    }
                } else {
                    ch = track.author
                }
                message.channel.send(
                    new MessageEmbed()
                    .setAuthor('Track added to queue: ')
                    .setTitle(track.title)
                    .setURL(track.uri)
                    .setDescription(
                        `**Author:** ${ch}\n**Requested By:** ${track.user}\n**Lengh:** ${!track.length ? '`🔴LIVE`' : formatTime(res[0].length)}\n**Stream:** ${track.isStream}`
                    )
                    .setThumbnail(track.thumbnail.max)
                    .setColor('BLUE')
                    .setTimestamp()
                )
            });
            collector.on("end", (_, reason) => {
                if(["time", "cancelled"].includes(reason)) {
                    if (player && !player.playing && !player.paused) {
                        player.destroy()
                    }
                    message.channel.send(
                        new MessageEmbed()
                        .setAuthor('Message collector stopped')
                        .setTitle('Song selection canceled')
                        .setColor('RED')
                        .setTimestamp()
                    )
                }
            });
        } else if (res.tracks) {
            player.queue.add(res.tracks);
            let listId
            if (query.match(/^.*(youtu.be\/|list=)([^#\&\?]*).*/) && query.match(/^.*(youtu.be\/|list=)([^#\&\?]*).*/)[2]) {
                listId = query.match(/^.*(youtu.be\/|list=)([^#\&\?]*).*/)[2]
            }
            const listRes = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${listId}&key=${parse(client.config).ytapikey}`)
            const listJson = await listRes.json()
            const listThumb = listJson.items[0].snippet.thumbnails.maxres.url
            message.channel.send(
                new MessageEmbed()
                .setAuthor('Playlist added to queue: ')
                .setTitle(res.name)
                .setDescription(
                    `**Tracks:** ${res.trackCount}\n**Duration:** ${formatTime(res.duration)}`
                )
                .setThumbnail(listThumb)
                .setColor('BLUE')
                .setTimestamp()
            )
            if (!player.playing) player.play();
        }
    }
}