const fetch = require('node-fetch');
const { parse } = require('../watson.js')
const { MessageEmbed } = require("discord.js")
exports.aliases = ["np"]
exports.run = async (client, message, args) => {
    const player = client.music.playerCollection.get(message.guild.id);
    if (!player || !player.playing) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Nothing is playing in this server.')
        .setTimestamp()
    );
    let ch
    if (player.queue.first.uri.includes('youtube')) {
      const r = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${player.queue.first.identifier}&key=${client.config.ytapikey}`);
      const j = await r.json();
      const q = j.items[0].snippet.channelId
      const l = `https://www.youtube.com/channel/${q}`
      if (q) {
        ch = `[${player.queue.first.author}](${l})`
      } else {
        ch = player.queue.first.author
      }
    }
    let upnext
    if (player.queue.autoNextYT) {
      upnext = "Auto (from Youtube)"
    } else {
      upnext = player.queue.KVArray().slice(1)[0] ? player.queue.KVArray().slice(1)[0][1].title : "Nothing"
    }
    if (player.queue.first.isStream && length === 9223372036854776000) {
      message.channel.send(
        new MessageEmbed()
          .setColor('BLUE')
          .setAuthor('Now Playing:')
          .setTitle(player.queue.first.title)
          .setURL(player.queue.first.uri)
          .setDescription(
              `${`\`▶️ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬⏺\` \`🔴LIVE\` \`🔀Normal\` \`🔊${player.volume}\``}\n**Author:** ${ch}\n**Requested By:** ${player.queue.first.user}`
          )
          .setThumbnail(player.queue.first.thumbnail.max)
          .setTimestamp()
      )
    } else {
      if (player.interval || player.intervalmsg) {
        clearInterval(player.interval)
          player.intervalmsg.delete().then(() => {
              message.channel.send(
                new MessageEmbed()
                .setColor('BLUE')
                .setAuthor('Now Playing:')
                .setTitle(player.queue.first.title)
                .setURL(player.queue.first.uri)
                .setDescription(
                    `${playbackBar()}\n**Author:** ${ch}\n**Requested By:** ${player.queue.first.user}\n**Up Next:** ${upnext}`
                )
                .setThumbnail(player.queue.first.thumbnail.max)
                .setTimestamp()
            ).then((msg) => {
              player.intervalmsg = msg;
              player.interval = setInterval(() => {
                player.intervalmsg.edit(
                  new MessageEmbed()
                  .setColor('BLUE')
                  .setAuthor('Now Playing:')
                  .setTitle(player.queue.first.title)
                  .setURL(player.queue.first.uri)
                  .setDescription(
                      `${playbackBar()}\n**Author:** ${ch}\n**Requested By:** ${player.queue.first.user}\n**Up Next:** ${upnext}`
                  )
                  .setThumbnail(player.queue.first.thumbnail.max)
                  .setTimestamp()
                )
              }, 5000)
            })
          })
      } else {
        message.channel.send(
          new MessageEmbed()
          .setColor('BLUE')
          .setAuthor('Now Playing:')
          .setTitle(player.queue.first.title)
          .setURL(player.queue.first.uri)
          .setDescription(
            `${playbackBar()}\n**Author:** ${ch}\n**Requested By:** ${player.queue.first.user}\n**Up Next:** ${upnext}`
          )
          .setThumbnail(player.queue.first.thumbnail.max)
          .setTimestamp()
      ).then((msg) => {
        player.intervalmsg = msg;
        player.interval = setInterval(() => {
          player.intervalmsg.edit(
            new MessageEmbed()
            .setColor('BLUE')
            .setAuthor('Now Playing:')
            .setTitle(player.queue.first.title)
            .setURL(player.queue.first.uri)
            .setDescription(
              `${playbackBar()}\n**Author:** ${ch}\n**Requested By:** ${player.queue.first.user}\n**Up Next:** ${upnext}`
            )
            .setThumbnail(player.queue.first.thumbnail.max)
            .setTimestamp()
          )
        }, 5000)
      })
      }
    }
    function playbackBar() {
        const passedTimeInMS = player.position;
        const passedTimeInMSObj = {
          seconds: Math.floor((passedTimeInMS / 1000) % 60),
          minutes: Math.floor((passedTimeInMS / (1000 * 60)) % 60),
          hours: Math.floor((passedTimeInMS / (1000 * 60 * 60)) % 24)
        };
        const passedTimeFormatted = formatDuration(
          passedTimeInMSObj
        );
        const songLengthInMs = player.queue.first.length;
        const songLengthObj = {
          seconds: Math.floor((songLengthInMs / 1000) % 60),
          minutes: Math.floor((songLengthInMs / (1000 * 60)) % 60),
          hours: Math.floor((songLengthInMs / (1000 * 60 * 60)) % 24)
        };
        const songLengthFormatted = formatDuration(
          songLengthObj
        )
        const playBackBarLocation = Math.round(
          (passedTimeInMS / player.queue.first.length) * 10
        );
        let playBack = '';
        for (let i = 1; i < 21; i++) {
          if (playBackBarLocation == 0) {
            playBack = '⏺▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬';
            break;
          } else if (playBackBarLocation == 10) {
            playBack = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬⏺';
            break;
          } else if (i == playBackBarLocation * 2) {
            playBack = playBack + '⏺';
          } else {
            playBack = playBack + '▬';
          }
        }
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
        const playState = player.paused ? "⏸️" : "▶️"
        playBack = `\`${playState}\` \`${playBack}\`  \`${passedTimeFormatted}/${songLengthFormatted}\` \`${loopState}\` \`${volState}${player.volume}\``;
        return playBack;
      }
      function formatDuration(durationObj) {
          const duration = `${durationObj.hours ? (durationObj.hours + ':') : ''}${
            durationObj.minutes ? durationObj.minutes : '00'
          }:${
            (durationObj.seconds < 10)
              ? ('0' + durationObj.seconds)
              : (durationObj.seconds
              ? durationObj.seconds
              : '00')
          }`;
          return duration;
      }
}
