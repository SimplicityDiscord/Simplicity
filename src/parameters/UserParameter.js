const CommandError = require('../structures/command/CommandError')
const Parameter = require('../structures/Parameter')

const MENTION_REGEX = /^(?:<@!?)?([0-9]{16,18})(?:>)?$/

class UserParameter extends Parameter {
  static parseOptions (options) {
    return Object.assign({
      ...super.parseOptions(options),
      canBeAuthor: true,
      canBeBot: true,
      canBeUser: true,
      checkGlobally: true
    }, options)
  }

  static parseMessageErrors (options = {}) {
    return Object.assign({
      ...super.parseMessageErrors(options),
      canBeBot: 'errors:canBeBot',
      canBeAuthor: 'errors:canBeAuthor',
      canBeUser: 'errors:canBeUser'
    }, options.errors)
  }

  static verifyExceptions (user, { author }, exeptions = {}) {
    exeptions = this.setupOptions(exeptions)

    if (!exeptions.canBeAuthor && user.id === author.id) throw new CommandError(exeptions.errors.canBeAuthor, { onUsage: true })
    if (!exeptions.canBeBot && user.bot) throw new CommandError(exeptions.errors.canBeBot, { onUsage: true })
    if (!exeptions.canBeUser && !user.bot) throw new CommandError(exeptions.errors.canBeAuthor, { onUsage: true })

    return user
  }

  static async search (query, { client, guild }, options) {
    options = this.setupOptions(options)
    if (!query || typeof query !== 'string') return
    const regexResult = MENTION_REGEX.exec(query)
    const id = regexResult && regexResult[1]
    const fetchID = id && ((client && client.users.get(id)) || (options.checkGlobally && (await client.users.fetch(id, true).catch(() => null))))
    const findName = guild && guild.members.find((m) => m.user.username.toLowerCase() === query.toLowerCase())
    const findNick = guild && guild.members.find((m) => m.displayName.toLowerCase() === query.toLowerCase())
    const findStartName = guild && guild.members.find((m) => m.user.username.toLowerCase().startsWith(query.toLowerCase()))
    const findStartNick = guild && guild.members.find((m) => m.displayName.toLowerCase().startsWith(query.toLowerCase()))

    return (fetchID || fetchID.user) || (findName && findName.user) || (findNick && findNick.user) || (findStartName && findStartName.user) || (findStartNick && findStartNick.user) || null
  }
}

module.exports = UserParameter
