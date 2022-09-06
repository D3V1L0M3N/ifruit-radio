
/*======================================================================\
||  Project: iFruit Radio - Discord Bot                                ||
||  Developed-by: D3V1L0M3N                                            ||
||  My-website: https://itsdevil.com/                                  ||
||  Permission: You may not distribute or claim my work as your own    ||
\======================================================================*/

require('dotenv').config();

const config = require('./config');
const logger = require('./modules/logger')
const { asyncForEach } = require('./modules/utils');
const fs = require('fs');
const chalk = require('chalk');
const Discord = require('discord.js');



// ERROR HANDLING
process.on('unhandledRejection', (err) => {
  logger.error('An unexpected process error occured: unhandledRejection:');
  console.error(err);
});



// INITIALIZATION
async function main() {
  // output version
  const { version, releaseDate } = require('./package.json');
  logger.log(`Version ${chalk.magenta(version)} - Released ${chalk.magenta(releaseDate)}`);


  if (process.env.NODE_ENV !== 'production') {
    logger.prompt('Launching in Development Mode: some features may be disabled');
  }


  // create new Discord bot Client
  const Client = new Discord.Client({
    intents: [
      Discord.GatewayIntentBits.Guilds
    ]
  });


  // load bot commands
  Client.commands = new Discord.Collection();

  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
  logger.log(`Loading ${commandFiles.length} commands..`);

  for (const file of commandFiles) {
    logger.log(`Loading file: ${file}`);
    const command = require(`./commands/${file}`);
    Client.commands.set(command.name, command);
  }


  // load event modules
  const eventFiles = await fs.readdirSync(`./events/`);
  logger.log(`Loading ${eventFiles.length} events..`);

  eventFiles.forEach(file => {
    logger.log(`Loading file: ${file}`);
    const eventName = file.split(`.`)[0];
    const event = require(`./events/${file}`);
    Client.on(eventName, event.bind(null, Client));
  });


  // login to Discord
  logger.log('Logging in to Discord..');
  Client.login(process.env.DISCORD_TOKEN).catch(console.error);
  await (() => new Promise((r) => Client.once('ready', () => r())))();


  // load services
  const serviceFiles = await fs.readdirSync(`./services/`);

  await asyncForEach(serviceFiles, async (file) => {
    try {
      const service = require(`./services/${file}`);
      if (!service.enabled) { return; }
      logger.log(`Starting service: ${chalk.yellow(file)} [${chalk.blueBright(service.name)}]`);
      await service.start();
    } catch(err) {
      logger.error(`An error occured while enabling service: ${file}`);
      console.error(err);
    }
  });


  // we're all good
  logger.success(`Ready! ` + chalk.bgGreen.white(`Took ${Math.round(process.uptime() * 1000)}ms`));
}



// ENTRY POINT
main();