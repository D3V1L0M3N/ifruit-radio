const logger = require('../modules/logger');


module.exports = async (Client, interaction) => {

  switch(interaction.type) {
    // ApplicationCommand
    case 2:

      if (interaction.user.bot) { return; }

      const command = Client.commands.get(interaction.commandName);
    
      // TODO:
      // - slash command is registered on Discord but not in bots' code :/
      if (!command) { return; }
    
      try {
        logger.info(`${interaction.user.tag}: Command: ${interaction.commandName}`);
        await command.run(Client, interaction);
      } catch(err) {
        logger.error(`An error occured while executing command: ${interaction.commandName}:`);
        console.error(err);
      }

      break;


    default:
      console.log('Unexpected interaction type!');
  }






	


};