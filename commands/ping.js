const responder = require('../modules/responder');


module.exports = {
  name: 'ping',
  description: 'Bot\'s latency to Discord servers.',

  run: async (Client, interaction) => {
    
    var ping = Client.ws.ping;
    var speed;
  
    if (ping < 25) { speed = 'Super Fast' }
    else if (ping < 50) { speed = 'Fast' }
    else if (ping < 100) { speed = 'Slow' }
    else { speed = 'Very Slow' }

    await responder.reply(Client, interaction, {
      description: `**Pong 🏓**\nLatency to Discord: \`${Client.ws.ping}ms\` (${speed})`
    });

  }
}