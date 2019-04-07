const { Embed, Command, MessageUtils, CommandError, MessageCollectorUtils, Parameters } = require('../..')
const { StringParameter } = Parameters
const INVALID_CHARACTERS_REGEX = /[^a-z0-9_]/gi

class AddEmoji extends Command {
  constructor (client) {
    super(client)
    this.aliases = ['createmoji', 'createemoji']
    this.category = 'guild'
    this.requirements = {
      argsRequired: true,
      guildOnly: true,
      permissions: ['MANAGE_EMOJIS'],
      clientPermissions: ['EMBED_LINKS', 'MANAGE_EMOJIS'] }
  }

  async run ({ args, author, channel, message, send, totalLength, t }) {
    const name = StringParameter.parse(args[0], {
      defaultString: 'emoji',
      maxLength: 32,
      minLength: 2,
      regex: INVALID_CHARACTERS_REGEX,
      errors: {
        maxLength: 'commands:addemoji:nameTooBig',
        minLength: 'commands:addemoji:nameTooShort',
        regex: 'commands:addemoji:nameInvalid'
      }
    })
    const image = (await MessageUtils.getImage(message, totalLength)) || (await MessageUtils.fetchImage(channel))
    if (!image) throw new CommandError('commands:addemoji:noNameLink', { onUsage: true })

    const msg = await send('to esperando a resposta po')
    msg.delete({ timeout: 60000 })

    MessageCollectorUtils.run({ channel, author, send, t }, {}, () => {
      // coloca aqui oq o bot tem q fazer quando o cara manda confirm
    })
  }
}

module.exports = AddEmoji
