'use strict';

module.exports = function (ctx) {

  const cmd = ctx.cmd;

  cmd.register('init', 'Initialize project', {}, require('./init'));
};
