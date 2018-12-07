'use strict';

const path = require('path');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const Generator = require('yeoman-generator');
const shell = require('shelljs');
const fse = require('fs-extra');

const utils = require('../utils');

const TestConfig = require('./TesterConfig');

const logger = utils.createLogger({});

module.exports = class extends Generator {

    constructor(...args) {
        super(...args);

        this.answers = {};

        this.testConfig = new TestConfig();
    }

    /**
     * Show template basic message.
     */
    initializing() {
        this.log(
            chalk.magenta(
                `\n欢迎使用 Matman 脚手架来创建 tester \n`
            )
        );
    }

    /**
     * Interact with developer.
     */
    prompting() {
        let isDev = this.options.isDev;
        let cwd = this.options.env.cwd;

        return this.prompt([{
            type: 'list',
            name: 'testerParentPath',
            message: '请选择 tester 放置的根目录',
            choices: function () {
                // 获取可选择的路径
                return utils.getMockServerPathList(cwd) || [];
            },
            validate: function (testerParentPath) {
                if (!testerParentPath) {
                    return 'tester 放置的根目录不能为空';
                }

                return true;
            }
        }, {
            type: 'input',
            name: 'testerUrl',
            message: '请输入需要测试的页面，例如： http://domain.com/index.html',
            validate: function (testerUrl) {
                if (!testerUrl) {
                    return '请输入需要测试的页面';
                }

                return true;
            }
        }, {
            type: 'input',
            name: 'testerMain',
            message: '请输入开始爬虫的标志dom，例如： #root .App',
            validate: function (testerMain) {
                if (!testerMain) {
                    return '请输入开始爬虫的标志dom';
                }

                return true;
            }
        }, {
            type: 'input',
            name: 'testerName',
            message: '请输入tester名称，只能够输入英文、数字和、- 及 _ ',
            default: function (answers) {
                return utils.getMockerNameFromURL(answers.testerUrl);
            },
            validate: function (testerName, answers) {
                if (!testerName) {
                    return 'tester名称不能为空';
                }

                // 默认情况下是在当前路径下新建以 projectName 为名字的文件夹，然后再进入其中生成代码。
                // 但如果当前路径下已经存在了，则需要进行提示，避免覆盖
                if (!isDev && fse.pathExistsSync(path.join(answers.testerParentPath, testerName))) {
                    return `当前目录下已经存在名字为 ${testerName} 的文件夹了`;
                }

                return true;
            }
        }]).then((answers) => {
            this.answers = answers;
            this.testConfig.updateByAnswer(this.answers);
        });
    }

    /**
     * Generator project files.
     */
    writing() {
        const { testerParentPath, testerName } = this.testConfig;

        const _copyTemplates = () => {
            const folderPath = path.join(testerParentPath, testerName);

            mkdirp(folderPath);
            shell.cd(folderPath);

            this.destinationRoot(this.destinationPath(folderPath));

            this.fs.copyTpl(
                this.templatePath('crawlers/_get-page-info'),
                this.destinationPath('crawlers/get-page-info.js'),
                {
                    testConfig: this.testConfig
                }
            );

            this.fs.copyTpl(
                this.templatePath('env/_index'),
                this.destinationPath('env/index.js'),
                {
                    testConfig: this.testConfig
                }
            );

            this.fs.copyTpl(
                this.templatePath('cases/basic-check/_index'),
                this.destinationPath('cases/basic-check/index.js'),
                {
                    testConfig: this.testConfig
                }
            );

            this.fs.copyTpl(
                this.templatePath('cases/basic-check/_index.test'),
                this.destinationPath('cases/basic-check/index.test.js'),
                {
                    testConfig: this.testConfig
                }
            );

        };

        _copyTemplates();
    }

    install() {
        logger.info('项目初始化完成');
    }

    end() {
        logger.info(`本次初始化过程结束。`);
    }
};
