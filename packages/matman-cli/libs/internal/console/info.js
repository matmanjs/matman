'use strict';

const Promise = require('bluebird');
const figlet = require('figlet');
const chalk = require('chalk');

module.exports = function (args) {
    // 此处的 this 即 Matman 对象
    const self = this;

    //  Font preview：http://patorjk.com/software/taag/#p=display&f=3D-ASCII&t=matman%0A
    figlet.text('matman', {
        font: '3D-ASCII',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    }, function (err, data) {
        if (err) {
            self.log.info('Something went wrong...');
            self.log.error(err);
            return;
        }

        console.log(chalk.cyan(data));
        console.log(chalk.cyan(` Matman，当前版本v${self.version}, 专注 web 前端端对端测试，主页: https://github.com/matmanjs/matman `));
        console.log(chalk.cyan(' (c) powered by IVWEB Team'));
        console.log(chalk.cyan(' Run matman --help to see usage. '));
    });

    return Promise.resolve();
};