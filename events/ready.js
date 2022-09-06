const logger = require('../utils/logger');


module.exports = async (Client) => {
  logger.log(`Logged in: ${Client.user.tag}`);
};