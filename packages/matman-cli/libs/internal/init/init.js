const meow = require('meow');

const initProject = require('./init-project');
const initTester = require('./init-tester');

/**
 *
 * @param {Object} args
 * @param {Array} args._ 参数，例如 matman init xxx yyy，则 args._ = [ 'xxx', 'yyy' ]
 * @param {Boolean} [args.dev] 是否为开发者模式，使用方式: matman init --dev
 * @param {String} [args.matman] matman 的版本号，使用方式: matman init --matman=1.5.0
 */
module.exports = function (args) {
    // node ./bin/matman init --matman=1.2.3
    // console.log(args);
    // matman init xxx yyy --dev --matman=1.5.3
    // { _: [ 'xxx', 'yyy' ], dev: true, matman: '1.5.3' }

    // 如果没有命令，则提示
    if (!args._.length) {
        return showHelp();
    }

    const command = args._[0];

    switch (command) {
        case 'project':
            return initProject(args);
        case 'tester':
            return initTester(args);
        default:
            return showHelp();
    }
};

function showHelp() {
    let arr = [];

    arr.push('    Usage: matman init <command> [options] ');
    arr.push('    Commands:');
    arr.push('        project    Initialize project.');
    arr.push('        tester     Initialize tester.');
    arr.push('    Options:');
    arr.push('        --dev                  Debug for development.');
    arr.push('    Report bugs to https://github.com/matmanjs/matman/issues.');

    // https://www.npmjs.com/package/meow
    return meow({
        description: false,
        help: arr.join('\n')
    }).showHelp(0);
}