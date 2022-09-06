// const { getVoiceConnection } = require('@discordjs/voice');
// const sendResponse = require('../modules/send-response');
// const createResponse = require('../modules/create-response');
// const { waitFor } = require('../modules/utils');


const logger = require('../utils/logger');
const responder = require('../modules/commandResponder');
const createVoiceStream = require('../modules/createVoiceStream');


module.exports = {
  name: 'join',
  description: 'Connect to voice channel.',

  run: async (Client, interaction) => {

    const channel = interaction.member.voice.channel;

    if (!channel) {
      return await responder.reply(Client, interaction, {
        description: `❌ Sorry, you must be connected to a voice channel!`
      });
    }

    if (!channel.joinable) {
      return await responder.reply(Client, interaction, {
        description: `❌ Sorry, I\'m not able join your voice channel!`
      });
    }
    
    // we might take a hot minute to join and start streaming
    await interaction.deferReply();


    try {
      let connection = await createVoiceStream(Client, channel);

      await interaction.editReply({
        embeds: [
          await responder.create({
            description: `🎶 **Connected to voice channel!**\nType \`/tune\` to choose a station to stream!`
          })
        ]
      });

    } catch (err) {

      logger.error('An error occured while connecting to voice channel:');
      console.error(err);

      await interaction.editReply({
        embeds: [
          await responder.create({
            description: `⚠ Something went wrong while connecting to voice channel!`
          })
        ]
      });

    }
  }
}