const playcmd = require("./play")
const { MessageEmbed } = require("discord.js")
const { formatTime } = require('../func.js')
const fetch = require('node-fetch')

exports.aliases = ["soundcloud"]
exports.run = async (client, message, args, flags) => {
    if (!args || args === []) return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Please input a search query or link after the command.')
        .setTimestamp()
    );
    const flag = [ 'sc' ]
    playcmd.run(client, message, args, flag)
}