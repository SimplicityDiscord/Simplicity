'use strict';

const { Command, CommandError, SimplicityEmbed } = require('../..');

class Language extends Command {
  constructor(client) {
    super(client, {
      aliases: ['lang', 'l', 'botlanguage'],
      category: 'bot',
      name: 'language',
      cooldown: 60000,
      requirements: {
        argsRequired: true,
        requireDatabase: true,
        permissions: ['MANAGE_GUILD'],
      },
    });
  }

  async run({ author, botLanguages, client, guild, language, query, send, t }) {
    const lang = botLanguages.find((i) => i.toLowerCase() === query.toLowerCase());
    const bl = botLanguages.map((i) => `\`${i}\``).join(', ');
    if (!lang) throw new CommandError('commands:language.invalidLang', { botLanguages: bl });

    if (language === lang) throw new CommandError('commands:language.alreadySet', { lang });

    const data = await client.database.guilds.edit(guild.id, { lang });
    if (!data) throw new CommandError('commands:language.failed');

    const embed = new SimplicityEmbed({ author, t })
      .setTitle('commands:language.done')
      .setDescription('commands:language.success', { lang });
    await send(embed);
  }
}

module.exports = Language;