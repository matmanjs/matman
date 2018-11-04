'use strict';
const meow = require('meow');

module.exports = function (args) {
    let arr = [];

    // 如果不是 -h 或者 --help 命令过来的，则需要提示命令不存在
    if (!args.h && !args.help) {
        arr.push('    WARNING: Command is NOT exist!');
        arr.push('\n');
    }

    arr.push('    Usage: matman [options] [command]');
    arr.push('\n');
    arr.push('    Commands:');
    arr.push('        build                                    Build the code.');
    arr.push('\n');
    arr.push('    Options:');
    arr.push('        --version, -[v]           Print version and exit successfully.');
    arr.push('        --help, -[h]              Print this help and exit successfully.');
    arr.push('\n');
    arr.push('    Report bugs to https://github.com/matmanjs/matman/issues.');

    // https://www.npmjs.com/package/meow
    return meow({
        description: false,
        help: arr.join('\n')
    }).showHelp(0);
};
