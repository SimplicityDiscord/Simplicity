'use strict';

const { Command } = require('@structures');

class Ping extends Command {
  constructor(client) {
    super(client, 'ping', {
      aliases: ['pong'],
      category: 'bot',
    });
  }

  async run({ channel, client, message }) {
    const ws = Math.ceil(client.ws.ping);
    const msg = await channel.send(`WebSocket: ${ws}ms`);
    await msg.edit(`WebSocket: ${ws}ms | Ping: ${Math.ceil(msg.createdTimestamp - message.createdTimestamp)}ms`);
  }
}

module.exports = Ping;
