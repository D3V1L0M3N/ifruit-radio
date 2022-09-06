// const { getVoiceConnection } = require('@discordjs/voice');
// const createResponse = require('../modules/create-response');
const logger = require('../utils/logger');

// const stations = require('../stations.json');


module.exports = async (Client, interaction) => {

  // must be on a server
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


    default:
      console.log('Unexpected interaction type!');
  }




  return;

  if (interaction.isSelectMenu() && interaction.customId === 'choose_station') {
    // select menu/station tune
    const connection = getVoiceConnection(interaction.guild.id);
    
    if (!connection) {
      return interaction.update({ embeds: [await createResponse('❌ **Radio not connected!**\nType \`/join\` to connect to a voice channel.', null, Client, interaction, 'tune')], components: [] });
    }

    try {
      // get the AudioPlayer associated with the chosen station
      let player = require('../services/audio-player').Stations.get(interaction.values[0]);

      if (!player) {
        throw new Error(`Failed to find AudioPlayer for station: ${interaction.values[0]}`);
      }
      
      // subscribe the connection to the player
      connection.subscribe(player);

      const station = stations.find(s => s.id === interaction.values[0])

      return interaction.update({ embeds: [await createResponse(`${station.emoji} Now streaming **${station.name}**`, null, Client, interaction, 'tune')], components: [] });

    } catch(err) {
      logger.error('An unexpected error occured while subscribing voice connection to player:');
      console.error(err);
      return interaction.update({ embeds: [await createResponse('⚠ Something went wrong while tuning the radio!', null, Client, interaction, 'tune')], components: [] });
    }
  }
	

	if (!interaction.isCommand()) { return; }

	


};