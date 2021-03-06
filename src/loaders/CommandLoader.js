'use strict';

const CommandCollection = require('@command/CommandCollection');
const { Loader } = require('@structures');
const { requireDirectory } = require('@util/FileUtil');
const Logger = require('@util/Logger');

class CommandLoader extends Loader {
  constructor(client) {
    super(client, true);
    this.commands = new CommandCollection();
  }

  async load() {
    await requireDirectory('src/commands', this.loadCommand.bind(this), (x, ...args) => Logger.error(x.stack, args));
    this.client.commands = this.commands;
    return true;
  }

  loadCommand(Command) {
    this.commands.register(new Command(this.client));
  }
}

module.exports = CommandLoader;
