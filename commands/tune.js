const config = require('../config');
const responder = require('../modules/commandResponder');
const Discord = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');


module.exports = {
  name: 'tune',
  description: 'Choose a station to stream.',

  run: async (Client, interaction) => {

    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      return await responder.reply(Client, interaction, {
        description: `❌ **Radio not connected!**\nType \`/join\` to connect to a voice channel.`
      });
    }

    // create select menu to choose station
    const selectMenu = new Discord.ActionRowBuilder().addComponents(
      new Discord.SelectMenuBuilder()
        .setCustomId('choose_station')
        .setPlaceholder('Choose a station')
        .addOptions(config.stations.map((station) => {
          return {
            label: station.name,
            description: station.description,
            emoji: station.emoji,
            value: station.id
          }}
        ))
    );

    await interaction.reply({
      embeds: [
        await responder.create({
          description: `**Tune The Radio**\nSelect an option below to tune in to your favourite radio station!`
        })
      ],
      components: [selectMenu]
    });

  }
}