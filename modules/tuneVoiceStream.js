const config = require('../config');
const responder = require('../modules/commandResponder');
const audioPlayer = require('../services/audio-player');
const { getVoiceConnection } = require('@discordjs/voice');
const logger = require('../utils/logger');


// tune an existing voice stream
module.exports = async (Client, interaction) => {

  const connection = getVoiceConnection(interaction.guild.id);

  if (!connection) {
    return await interaction.update({
      embeds: [
        await responder.create({
          description: `❌ **Radio not connected!**\nType \`/join\` to connect to a voice channel.`
        })
      ],
      components: []
    });
  }
  
  // get the AudioPlayer associated with the chosen station
  let player = audioPlayer.getStation(interaction.values[0]);

  try {

    if (!player) {
      throw new Error(`Failed to find AudioPlayer for station: ${interaction.values[0]}`);
    }

    // subscribe the connection to the player
    connection.subscribe(player);

    const stationDetails = config.stations.find(station => station.id === interaction.values[0]);

    interaction.update({
      embeds: [
        responder.create({
          description: `${stationDetails.emoji} Now streaming **${stationDetails.name}**`
        })
      ],
      components: []
    });

  } catch(err) {

    logger.error('An error occured while tuning voice stream radio:');
    console.error(err);

    interaction.update({
      embeds: [
        responder.create({
          description: `⚠ Something went wrong while tuning the radio!`
        })
      ],
      components: []
    });

  }
}