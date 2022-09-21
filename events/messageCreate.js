
module.exports = async (Client, message) => {
  if (message.mentions.users.has(Client.user.id)) {
    return message.channel.send(`Hey, **${message.author}**! For a list of commands, type \`/help\``);
  }
}