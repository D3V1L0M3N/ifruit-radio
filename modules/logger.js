const timestamp = require('time-stamp');
const chalk = require('chalk');

module.exports = {
  log: function(entry) {
    console.log(chalk.cyan(`${timestamp('[YYYY:MM:DD HH:mm:ss:ms]')} [SYSTEM]: ${entry}`));
  },
  info: function(entry) {
    console.log(chalk.white(`${timestamp('[YYYY:MM:DD HH:mm:ss:ms]')} [INFO]: ${entry}`));
  },
  success: function(entry) {
    console.log(chalk.green(`${timestamp('[YYYY:MM:DD HH:mm:ss:ms]')} [INFO]: ${entry}`));
  },
  warn: function(entry) {
    console.log(chalk.yellow(`${timestamp('[YYYY:MM:DD HH:mm:ss:ms]')} [WARN]: ${entry}`));
  },
  prompt: function(entry) {
    console.log(chalk.white.bgMagenta(`${timestamp('[YYYY:MM:DD HH:mm:ss:ms]')} [UPDATE]: ${entry}`));
  },
  error: function(entry) {
    console.log(chalk.red(`${timestamp('[YYYY:MM:DD HH:mm:ss:ms]')} [ERROR]: ${entry}`));
  }
}