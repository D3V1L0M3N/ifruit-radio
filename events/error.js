const logger = require('../modules/logger');

module.exports = async (Client, err) => {
  logger.error('A Discord API error occured:')
  console.error(err);
};