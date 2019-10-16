'use strict';

const { Command } = require('../../');

class Ping extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      aliases: ['pong'],
      category: 'bot',
    });
  }

  async run({ message, send, t }) {
    const msg = await send(t('commands:ping.loading'));
    msg.edit(t('commands:ping.success', { ping: msg.createdTimestamp - message.createdTimestamp }));
  }
}

module.exports = Ping;