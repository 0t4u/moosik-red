exports.run = (client, message, args) => {
  if(message.author.id !== '379928776857092097') return;
    if(!args || args.length < 1) return message.reply("Must provide a command name to reload.");
    const commandName = args[0];
    if(!client.commands.has(commandName) || client.aliases.has(commandName)) {
      return message.reply("That command does not exist");
    }
    delete require.cache[require.resolve(`./${commandName}.js`)];
    client.commands.delete(commandName);
    const props = require(`./${commandName}.js`);
    client.commands.set(commandName, props);
    console.log("Command " + commandName + " reloaded")
    if (props.aliases) {
      props.aliases.forEach(alias => {
        client.aliases.set(alias, props)
        console.log("Alias " + alias + " reloaded for " + commandName)
      })
    }
    message.reply(`The command ${commandName} has been reloaded`);
  };