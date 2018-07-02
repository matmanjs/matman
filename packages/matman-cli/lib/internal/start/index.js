'use strict';

module.exports = function (ctx) {

  const cmd = ctx.cmd;

  cmd.register('start', 'Start local server', {}, require('./start'));
};
