const { joinVoiceChannel } = require('@discordjs/voice');


// connect to voice channel
module.exports = async (Client, channel) => {

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator
  });

  return connection;

}