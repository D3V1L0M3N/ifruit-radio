const logger = require('../utils/logger');
const tuneVoiceStream = require('../modules/tuneVoiceStream');


module.exports = async (Client, interaction) => {

  // must be in a server
  if (!interaction.guild) { return; }

  // ignore bots
  if (interaction.user.bot) { return; }

  switch(interaction.type) {
    // ApplicationCommand
    case 2:

      const command = Client.commands.get(interaction.commandName);

      if (!command) {
        return logger.warn(`Registered command does not exist: ${interaction.commandName}`);
      }
    
      try {
        logger.info(`${interaction.user.tag}: Command: ${interaction.commandName}`);
        await command.run(Client, interaction);
      } catch(err) {
        logger.error(`An error occured while executing command: ${interaction.commandName}:`);
        console.error(err);
      }

      break;

    // MessageComponent
    case 3:
      
      if (interaction.isSelectMenu() && interaction.customId === 'choose_station') {
        try {
          await tuneVoiceStream(Client, interaction);
        } catch(err) {
          console.log('Oopsie! Something bad happened!');
          console.error(err);
        }
      }

      break;

    // Any other interaction
    default:
      logger.error(`An unexpected Discord interaction was recieved: type ${interaction.type}`);
      console.log(interaction);
  }

};