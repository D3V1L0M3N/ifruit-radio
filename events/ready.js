const logger = require('../modules/logger');


module.exports = async (Client) => {
  logger.log(`Logged in: ${Client.user.tag}`);
};