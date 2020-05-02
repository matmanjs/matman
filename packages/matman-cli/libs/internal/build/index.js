'use strict';

module.exports = function (ctx) {

  const cmd = ctx.cmd;

  cmd.register('build', 'Build crawler script', {}, require('./build'));
};
