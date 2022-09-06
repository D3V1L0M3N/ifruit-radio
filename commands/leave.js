// const Discord = require('discord.js')
// const sendResponse = require('../modules/send-response');

const logger = require('../utils/logger');
const responder = require('../modules/commandResponder');
const { getVoiceConnection } = require('@discordjs/voice');


module.exports = {
  name: 'leave',
  description: 'Disconnect from voice channel.',

  run: async (Client, interaction) => {

    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      return await responder.reply(Client, interaction, {
        description: `❌ Sorry, I\'m not connected to any voice channel!`
      });
    }

    const channel = Client.channels.cache.get(connection.joinConfig.channelId);
    const listeners = channel.members.filter(member => member.id !== interaction.user.id && !member.user.bot).size;

    if (listeners && !interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MEMBERS)) {
      return await responder.reply(Client, interaction, {
        description: `❌ Sorry, there are other people listening to the radio! You can bypass this message if you have \`MANAGE_MEMBERS\` permission.`
      });
    }

    try {

      connection.destroy();

      await responder.reply(Client, interaction, {
        description: `🎶 Disconnected from voice channel!`
      });

    } catch(err) {

      logger.error('An error occured while disconnecting from voice channel:');
      console.error(err);

      await responder.reply(Client, interaction, {
        description: `⚠ Something went wrong while disconnecting from voice channel!`
      });

    }
  }
}