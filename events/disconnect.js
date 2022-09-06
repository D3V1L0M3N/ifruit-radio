const logger = require('../utils/logger');

module.exports = async (Client, closeEvent) => {
  logger.warn(`Discord API Disconnected: Status Code: ${closeEvent.code}, Was Clean: ${closeEvent.wasClean}, Reason: ${closeEvent.reason}`);
};