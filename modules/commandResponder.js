const config = require('../config');
const Discord = require('discord.js');


// create an embed with options passed in
// - returns embed
function create(embedOptions) {

  const embed = new Discord.EmbedBuilder()
    .setColor(config.themeColor)
    .setDescription(embedOptions.description);

  // TODO:
  // use as actual new Embed(options object) ?
  // see: https://discordjs.guide/popular-topics/embeds.html#using-an-embed-object
    
  if (embedOptions.thumbnail) {
    embed.setThumbnail(thumbnail);
  }

  return embed;
}


// reply to an interaction
async function reply(Client, interaction, embedOptions) {  
  await interaction.reply({
    embeds: [
      create(embedOptions)
    ]
  });
}



module.exports = {
  create: create,
  reply: reply
}