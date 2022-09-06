const config = require('../config');
const logger = require('../utils/logger');
const { asyncForEach, waitFor } = require('../utils/utils');

const chalk = require('chalk');
const Discord = require('discord.js');
const { AudioPlayerStatus, createAudioPlayer, createAudioResource, NoSubscriberBehavior, entersState } = require('@discordjs/voice');

// collection of AudioPlayers
// - mapped by station IDs
const Stations = new Discord.Collection();



function getStation(stationId) {
  return Stations.get(stationId);
}



// start AudioPlayer stream
// - will keep trying load() until no errors are emitted
function startAudioPlayer(player, streamURL) {
  return new Promise(async (resolve, reject) => {
    async function load() {
      try {
        const resource = createAudioResource(streamURL);
        await player.play(resource);
        resolve();
      } catch(err) {
        logger.error(`[Audio Player Manager]: Failed to start audio stream: ${streamURL} - retrying in 30 seconds`);
        console.error(err);
        await waitFor(30000);
        load(); // try again in 30 seconds
      }
    }

    load(); // start the "loop"
  });
}



async function start(Client) {
  logger.log(chalk.cyan(`[${chalk.blueBright('Audio Player Manager')}]: Initializing ${chalk.magentaBright(config.stations.length)} radio stations`));

  // for every station in config.stations
  // - create an AudioPlayer
  // - wait for the AudioPlayer to start playing
  // - attach some event listeners that restart stream when errors happen

  await asyncForEach(config.stations, async (station) => {
    logger.log(chalk.cyan(`[${chalk.blueBright('Audio Player Manager')}]: Enabling station => ${chalk.grey(station.id)}`));

    // create AudioPlayer
    let player = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Play }
    });

    player.on('error', async (err) => {
      logger.error(`[Audio Player Manager]: An error occured with audio player for station: ${station.id}`);
      console.error(err);
    });

    player.on(AudioPlayerStatus.Playing, () => {
      logger.log(chalk.cyan(`[${chalk.blueBright('Audio Player Manager')}]: ${chalk.greenBright(`Audio Playing`)} => ${chalk.grey(station.id)}`));
    });
    
    player.on(AudioPlayerStatus.Idle, async () => {
      // restart audio stream when AudioPlayer becomes IDLE
      logger.log(chalk.cyan(`[${chalk.blueBright('Audio Player Manager')}]: ${chalk.yellow(`Audio Idle`)} => ${chalk.grey(station.id)} (restarting in 30 seconds)`));
      await waitFor(30000);
      await startAudioPlayer(player, station.streamURL);
    });

    // start playing audio
    await startAudioPlayer(player, station.streamURL);

    await new Promise(async (resolve, reject) => {
      player.once(AudioPlayerStatus.Playing, () => resolve());
    });

    await waitFor(500);
  
    Stations.set(station.id, player);
  });

  logger.log(chalk.cyan(`[${chalk.blueBright('Audio Player Manager')}]: All stations are active!`));
}


module.exports = {
  name: 'Audio Player Manager',
  enabled: true,
  start: start,

  getStation: getStation
}