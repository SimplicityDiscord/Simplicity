'use strict';

const { Command, CommandError, SimplicityEmbed } = require('@structures');

class SetNick extends Command {
  constructor(client) {
    super(client, 'setnick', {
      aliases: ['nick', 'nickname', 'setnickname'],
      args: [
        {
          acceptBot: true,
          acceptSelf: true,
          authorHasHigh: true,
          clientHasHigh: true,
          missingError: 'errors:invalidUser',
          required: true,
          type: 'member',
        },
        {
          clean: true,
          maxLength: 32,
          required: false,
          type: 'string',
        },
      ],
      category: 'mod',
      requirements: {
        clientPermissions: ['MANAGE_NICKNAMES'],
        guildOnly: true,
        permissions: ['MANAGE_NICKNAMES'],
      },
    });
  }

  async run({ t, author, client, channel }, member, nickname = '') {
    if (member.displayName === nickname) {
      throw new CommandError('commands:setnick.alreadySet', { member, nickname });
    } else if (!member.nickname && !nickname) {
      throw new CommandError('commands:setnick.alreadyReset', { member });
    }

    try {
      const reason = t('commands:setnick.reason', { author: author.tag });
      await member.setNickname(nickname, reason);
    } catch (error) {
      client.logger.error(error);
      throw new CommandError('commands:setnick.failed');
    }

    const text = nickname ? 'commands:setnick.success' : 'commands:setnick.removedNickname';

    const embed = new SimplicityEmbed({ author })
      .setDescription(t(text, { member: member.user.tag, nickname }));
    return channel.send(embed);
  }
}

module.exports = SetNick;
