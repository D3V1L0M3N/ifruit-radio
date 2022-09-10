const fetch = require(`node-fetch`);
const logger = require('../utils/logger');


// update bot statistics on TopGG
async function updateTopggStats(Client) {
  console.log(Client.guilds.cache.size);

  try {
    await fetch('https://top.gg/api/bots/937943569287774229/stats', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.TOPGG_TOKEN
      },
      body: JSON.stringify({
        "server_count": Client.guilds.cache.size
      })
    });
  } catch(err) {
    logger.error('[TopGG Stats]: An error occured while updating TopGG Bot Statistics:');
    console.error(err);
  }
}


async function start(Client) {
  return new Promise(async (resolve, reject) => {
    // update bot statistics on top.gg every hour
    setInterval(() => {
      updateTopggStats(Client)
    }, 1000 * 60 * 60);

    resolve();
  });
}


module.exports = {
  name: 'TopGG Stats',
  enabled: process.env.NODE_ENV === 'production',
  start: start,
}