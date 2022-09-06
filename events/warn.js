const logger = require('../utils/logger');

module.exports = async (Client, warn) => {
  logger.warn('Discord API Warning:');
  console.log(warn);
}