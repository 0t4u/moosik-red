exports.run = async (client, message, args) => {
    if(message.author.id !== '379928776857092097'/* || message.author.id !== '651155235699687465'/* || message.author.id !== '300533181403365376'*/) return;
    function clean(text) {
        if (typeof(text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
        }
        try {
            const code = args.join(" ");
            let evaled = eval(code);
           
            if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
                
            let hrStart = process.hrtime()
                let hrDiff;
                hrDiff = process.hrtime(hrStart);
            message.channel.send({embed: {
                color: 'GREEN',
                title: '\`✅\` Output ',
                description: `\`\`\`xl\n${clean(evaled)}\n\`\`\``/*\n*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*`*/
            }});
            } catch (err) {
            message.channel.send({embed:{
                color: 'RED',
                title: `\`❗️\` Error `,
                description: `\`\`\`xl\n${clean(err)}\n\`\`\``/*\n*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*`*/
            }});
        }
}