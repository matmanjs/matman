'use strict';

module.exports = function (ctx) {
    const cmd = ctx.cmd;

    cmd.register('help', 'Get help on a command.', {}, require('./help'));
    cmd.register('version', 'Display version information.', {}, require('./version'));
    cmd.register('info', 'Display some information about Matman.', {}, require('./info'));
};
