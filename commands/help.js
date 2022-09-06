const responder = require('../modules/commandResponder');


module.exports = {
  name: 'help',
  description: 'List all bot commands.',

  run: async (Client, interaction) => {
    
    var commandList = '';

    Client.commands.forEach(cmd => commandList += `**${cmd.name}** ${cmd.description}\n`);

    await responder.reply(Client, interaction, {
      description: `Here is a full list of available bot commands:\n\n${commandList}`
    });

  }
}