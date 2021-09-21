//defining stuff
const Discord = require("discord.js");
const { LavaClient } = require("@anonymousg/lavajs");
const nodes = require('./nodes.json');
const fetch = require('node-fetch');
const { formatTime }  = require("./func.js");
const fs = require("fs");
const Enmap = require("enmap");
//const SQLite = require("better-sqlite3");
//const sql =  new SQLite('./data/opt.sqlite');
//defining moar stuff
const client = new Discord.Client({
  intents: /*14029*/32767,
  //being smart and trying to get myself banned from discord api
  ws: {
    $browser: 'Discord Android'
  }
});
client.commands = new Enmap();
client.config = require("./config.json");

//catching common errors
process.on('unhandledRejection', error => {
  console.error(`> A unhandled rejection error occured: \n${error}`)
}) 
process.on('uncaughtException', error => {
  console.error(`> A uncaught exception error occured: \n${error}`)
})
//updating stuffs before exiting
process.on('SIGINT', () => {
  process.stdin.resume()
  console.log('\nRecieved SIGINT process interrupt.\nPreforming cleanup...')
  client.music.playerCollection.forEach((player) => {
    player.destroy()
    console.log(`Destroyed ${player.options.guild} with playing player.`)
  })
  console.log('Exiting...')
  process.exit()
})
//timeout system
//let timeoutID

client.on('ready', () => {
  //setting activities
  let activities = [ `Prefix: ${client.config.prefix}`, `Version: ${require('./package.json').version} beta`, `Discord.js: ${require('./package.json').dependencies['discord.js']}` ], i = 0;
  setInterval(() => client.user.setPresence({ status: 'online', activity: {name: `Music | ${activities[i++ % activities.length]}`, type: `PLAYING`}}), 15000);
  //lavajs + lavajs events
  client.music = new LavaClient(client, nodes);

  client.music.on("nodeSuccess", node => {
    console.log(`Node connected: ${node.options.host}`)
  });
  client.music.on("nodeReconnect", node => {
    console.log(`Node reconnected: ${node.options.host}`)
  });
  client.music.on("nodeError", (node, error) => {
    console.log(`Node ${node.options.host} emmited error: ${error}`)
  });
  client.music.on("nodeClose", (node, error) => {
    console.log(`Node ${node.options.host} closed with error: ${error}`)
    if (node.systemStats.players >= 1) {
      node.lavaJS.playerCollection.forEach((value, key, map) => {
        let player = client.music.playerCollection.get(key);
        player.options.textChannel.send(
          new Discord.MessageEmbed()
          .setAuthor(`Lavalink Error:`)
          .setTitle(`Lavalink Disconnected`)
          .setDescription(`\n\`\`\`${JSON.stringify(error.error)}\`\`\`\nSorry about that. This player will also disconnect.`)
          .setColor('RED')
          .setTimestamp()
        )
        player.destroy();
      });
    }
  });
  client.music.on("createPlayer", (player) => {
    console.log(`New player at guild "${player.options.guild}" with voice channel ${player.options.voiceChannel} and text channel ${player.options.textChannel}`)
  })
  client.music.on("destroyPlayer", (player) => {
    console.log(`Player destroyed at guild "${player.options.guild}" with voice channel ${player.options.voiceChannel} and text channel ${player.options.textChannel}`)
  })
  client.music.on("trackPlay", async (track, player) => {
    const { title, length, uri, thumbnail, user, isStream, author, identifier } = track;
    let ch
    if (uri.includes('youtube')) {
      const r = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${identifier}&key=${client.config.ytapikey}`);
      const j = await r.json();
      const q = j.items[0].snippet.channelId
      const l = `https://www.youtube.com/channel/${q}`
      if (q) {
        ch = `[${author}](${l})`
      }
    } else {
      ch = author
    }
    let upnext
    if (player.queue.autoNextYT) {
      upnext = "Auto (from Youtube)"
    } else {
      upnext = player.queue.KVArray().slice(1)[0] ? player.queue.KVArray().slice(1)[0][1].title : "Nothing"
    }
    if (isStream && length === 9223372036854776000) {
      player.options.textChannel.send(
        new Discord.MessageEmbed()
          .setColor('BLUE')
          .setAuthor('Now Playing:')
          .setTitle(title)
          .setURL(uri)
          .setDescription(
              `${`\`▶️ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬⏺\` \`🔴LIVE\` \`🔀Normal\` \`🔊${player.volume}\``}\n**Author:** ${ch}\n**Requested By:** ${user}`
          )
          .setThumbnail(thumbnail.max)
          .setTimestamp()
      )
    } else {
      if (player.interval || player.intervalmsg) {
        clearInterval(player.interval)
          player.intervalmsg.delete().then(() => {
            player.options.textChannel.send(
                new Discord.MessageEmbed()
                .setColor('BLUE')
                .setAuthor('Now Playing:')
                .setTitle(title)
                .setURL(uri)
                .setDescription(
                    `${playbackBar()}\n**Author:** ${ch}\n**Requested By:** ${user}\n**Up Next:** ${upnext}`
                )
                .setThumbnail(thumbnail.max)
                .setTimestamp()
            ).then((msg) => {
              player.intervalmsg = msg;
              player.interval = setInterval(() => {
                player.intervalmsg.edit(
                  new Discord.MessageEmbed()
                  .setColor('BLUE')
                  .setAuthor('Now Playing:')
                  .setTitle(title)
                  .setURL(uri)
                  .setDescription(
                      `${playbackBar()}\n**Author:** ${ch}\n**Requested By:** ${user}\n**Up Next:** ${upnext}`
                  )
                  .setThumbnail(thumbnail.max)
                  .setTimestamp()
                )
              }, 5000)
            })
          })
      } else {
        player.options.textChannel.send(
          new Discord.MessageEmbed()
          .setColor('BLUE')
          .setAuthor('Now Playing:')
          .setTitle(title)
          .setURL(uri)
          .setDescription(
            `${playbackBar()}\n**Author:** ${ch}\n**Requested By:** ${user}\n**Up Next:** ${upnext}`
          )
          .setThumbnail(thumbnail.max)
          .setTimestamp()
      ).then((msg) => {
        player.intervalmsg = msg;
        player.interval = setInterval(() => {
          player.intervalmsg.edit(
            new Discord.MessageEmbed()
            .setColor('BLUE')
            .setAuthor('Now Playing:')
            .setTitle(title)
            .setURL(uri)
            .setDescription(
              `${playbackBar()}\n**Author:** ${ch}\n**Requested By:** ${user}\n**Up Next:** ${upnext}`
            )
            .setThumbnail(thumbnail.max)
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
        const songLengthInMs = length;
        const songLengthObj = {
          seconds: Math.floor((songLengthInMs / 1000) % 60),
          minutes: Math.floor((songLengthInMs / (1000 * 60)) % 60),
          hours: Math.floor((songLengthInMs / (1000 * 60 * 60)) % 24)
        };
        const songLengthFormatted = formatDuration(
          songLengthObj
        )
        const playBackBarLocation = Math.round(
          (passedTimeInMS / length) * 10
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
  });
  client.music.on("queueOver", (player) => {
    if (!player.queue.autoNextYT) {
      if (player.interval && player.intervalmsg) {
        clearInterval(player.interval)
        player.intervalmsg.edit(
          new Discord.MessageEmbed()
          .setColor('BLUE')
          .setAuthor('Ended')
          .setTitle(player.queue.first.title)
          .setURL(player.queue.first.uri)
          .setThumbnail(player.queue.first.thumbnail.max)
          .setTimestamp()
        )
        player.interval = null
        player.intervalmsg = null
      }
      player.options.textChannel.send(
        new Discord.MessageEmbed()
        .setAuthor('Player Destroyed:')
        .setTitle('Queue Ended')
        .setDescription('No more tracks in queue. Left voice channel.')
        .setColor('BLUE')
        .setTimestamp()
      )
      player.destroy();
    }
    /*if (!timeoutID) {
      timeoutID = setTimeout(() => {
        player.destroy()
      }, 15 * 60 * 1000)
    }*/
  })
  client.music.on("trackOver", async (track, player) => {
    const { title, length, uri, thumbnail, user, isStream, identifier } = track;
    if (player.interval && player.intervalmsg) {
      clearInterval(player.interval)
      player.intervalmsg.edit(
        new Discord.MessageEmbed()
        .setColor('BLUE')
        .setAuthor('Ended')
        .setTitle(title)
        .setURL(uri)
        .setThumbnail(thumbnail.max)
        .setTimestamp()
      )
      player.interval = null
      player.intervalmsg = null
    }
    if (player.queue.autoNextYT && player.queue.size === 1 || player.queue.autoNextYT && player.queue.size === 0) {
      player.options.textChannel.send(
        new Discord.MessageEmbed()
        .setColor('BLUE')
        .setTitle('Info')
        .setDescription('Loading next song from Youtube.')
        .setTimestamp()
      ).then(async (msg) => {
        const r = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${identifier}&type=video&key=${client.config.ytapikey}`);
        const j = await r.json();
        const q = j.items[1].id.videoId
        const s = `https://www.youtube.com/watch?v=${q}`
        const res = await player.lavaSearch(s, client.user, { source: 'yt', add: false }).catch(() => {
          return msg.edit(
              new Discord.MessageEmbed()
              .setColor('RED')
              .setTitle('Error')
              .setDescription('An error occured and the next song cannot be found.')
              .setTimestamp()
          ).then(() => {
            player.destroy()
          })
        })
        player.queue.add(res[0])
        msg.delete().catch()
        if (!player.playing) {
          player.play()
        }
      })
    }
  })
  client.music.on("trackStuck", (track, player, error) => {
    console.log(`Player at guild "${player.options.guild}" with voice channel ${player.options.voiceChannel} and text channel ${player.options.textChannel} emmited track stuck: \n${JSON.stringify(error.error) ? JSON.stringify(error.error) : "Unknown"}`)
    const { title, length, uri, thumbnail, user, isStream } = track;
    player.options.textChannel.send(
      new Discord.MessageEmbed()
      .setAuthor(`Track Stuck:`)
      .setTitle(`${title} skipped due to an error.`)
      .setURL(uri)
      .setDescription(`\n\`\`\`${JSON.stringify(error.error) ? JSON.stringify(error.error) : "Unknown"}\`\`\`\n**Requested By:** ${user}\n**Length:** ${!length || length === 9223372036854776000 ? '`🔴LIVE`' : formatTime(length)}`)
      .setThumbnail(thumbnail.max)
      .setColor('RED')
      .setTimestamp()
    )
    if (player.queue.size === 0) { 
     player.destroy() 
    } else {
    player.play()
    }
  })
  client.music.on("trackError", (track, player, error) => {
    console.log(`Player at guild "${player.options.guild}" with voice channel ${player.options.voiceChannel} and text channel ${player.options.textChannel} emmited track error: \n${JSON.stringify(error.error) ? JSON.stringify(error.error) : "Unknown"}`)
    let eamt = 0
    const { title, length, uri, thumbnail, user, isStream } = track;
    player.options.textChannel.send(
      new Discord.MessageEmbed()
      .setAuthor(`Track Error:`)
      .setTitle(`${title} skipped due to an error.`)
      .setURL(uri)
      .setDescription(`\n\`\`\`${JSON.stringify(error.error) ? JSON.stringify(error.error) : "Unknown"}\`\`\`\n**Requested By:** ${user}\n**Length:** ${!length || length === 9223372036854776000 ? '`🔴LIVE`' : formatTime(length)}`)
      .setThumbnail(thumbnail.max)
      .setColor('RED')
      .setTimestamp()
    )
    if (player.queue.size === 0) { 
      player.destroy() 
    } else if (player.queue.repeatTrack || player.queue.repeatQueue) {
      if (eamt = 5) {
        player.destroy()
      } else {
        player.play()
      }
    } else {
     player.play()
    }
  })
  console.log('Ready!')
});
//commands handler
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
//client.events = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if (err) {
        let errorAmount = errorAmount + 1;
        console.log(`[${errorAmount}] There was an error while loading commands.`);
        throw err;
    }

    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        console.log("Loaded " + file)
        let commandName = file.split(".")[0];
        client.commands.set(commandName, props);
        if (props.aliases) {
          props.aliases.forEach(alias => {
            client.aliases.set(alias, props)
            console.log("Alias " + alias + " loaded for " + file)
          })
      }
    });
});

client.on('message', message => {
  if (message.author.bot) return;
  if (message.content.startsWith(client.config.prefix || message.mentions.has(client.user))) {
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let flags = [];
  while (args[0] && args[0][0] === "-") {
    flags.push(args.shift().slice(1));
  }
  
  /*if (timeoutID) {
    clearTimeout(timeoutID)
    timeoutID = undefined
  }*/

  let commandfile = client.commands.get(cmd.slice(client.config.prefix.length)) || client.aliases.get(cmd.slice(client.config.prefix.length));
  if (!commandfile) return;
  commandfile.run(client, message, args, flags);
}});
// Login to Discord
client.login(client.config.token)
/*
// API Server
const express = require('express')
const api = express();

api.get('/stats', (req, res) => {
  const cpuStat = require('cpu-stat')
  const os = require('os') 
  cpuStat.usagePercent((error, percent) => {
    if (error) {
      return res.json({
        "code": 500,
        "error": error
      })
    }
    const cores = os.cpus().length //CPU cores.
    const cpuModel = os.cpus()[0].model //CPU model.
    const avgClockMHZ = cpuStat.avgClockMHz();
    // const platform = os.platform(); //Platform
    const guilds = client.guilds.cache.size
    const users = client.users.cache.size
    const channels = client.channels.cache.size
    const usage = process.memoryUsage().heapUsed //MEM usage.
    const CPU = parseFloat(percent.toFixed(2)) //CPU usage.
    return res.json({
      "code": 200,
      "guilds": guilds,
      "channels": channels,
      "users": users,
      "ram": usage,
      "cpu": {
        "model": cpuModel,
        "cores": cores,
        "clock": avgClockMHZ,
        "usage": CPU
      }
    })
  })
})

api.get('/node/:node', (req, res) => {
  if (req.params.node === 'contabo') {
    if (client.music) {
       if (client.music.nodeCollection.get('62.171.174.121')) {
        return res.json({
          "code": 200,
          "stats": client.music.nodeCollection.get('62.171.174.121').systemStats
        })
      } else {
        return res.json({
          "code": 500,
          "error": "Cannot get node"
        })
      }
    } else {
      return res.json({
        "code": 500,
        "error": "Cannot get node" 
      })
    }
  } else {
    return res.json({
      "code": 500,
      "error": "Cannot get node" 
    })
  }
})

stringisafe = (obj, indent = 2) => {
  let cache = [];
  const retVal = JSON.stringify(
    obj,
    (key, value) =>
      typeof value === "object" && value !== null
        ? cache.includes(value)
          ? undefined // Duplicate reference found, discard key
          : cache.push(value) && value // Store value in our collection
        : value,
    indent
  );
  cache = null;
  return retVal;
};

api.get('/player/:guildid', (req, res) => {
  if (client.music) {
    const d = client.music.playerCollection.get(req.params.guildid)
    if (d) {
      res.json({
        "code": 200,
        "player": JSON.parse(stringisafe(d))
      })
    }
  }
})

app.use(express.static('assets'))

api.listen(3333, () => {
  console.log('API listening on port 3333.')
})
*/