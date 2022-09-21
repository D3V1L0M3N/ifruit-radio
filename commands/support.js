const config = require('../config');
const responder = require('../modules/commandResponder');


module.exports = {
  name: 'support',
  description: 'Send an invite to the support server.',

  run: async (Client, interaction) => {
    
    await responder.reply(Client, interaction, {
      description: `**Need help with the bot?**\n[Click to join our support server!](${config.serverInvite})`
    });

  }
}