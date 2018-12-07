'use strict';

const path = require('path');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const Generator = require('yeoman-generator');
const shell = require('shelljs');
const fse = require('fs-extra');

const utils = require('../utils');

const ProjectConfig = require('./ProjectConfig');
const TesterConfig = require('../tester/TesterConfig');

const logger = utils.createLogger({});

module.exports = class extends Generator {

    constructor(...args) {
        super(...args);

        this.answers = {};

        this.projectConfig = new ProjectConfig(this.options);
    }

    /**
     * Show template basic message.
     */
    initializing() {
        this.log(
            chalk.magenta(
                `\n欢迎使用 Matman 脚手架来创建 project！\n`
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
            type: 'input',
            name: 'projectName',
            message: '请输入项目名称，只能够输入英文、数字和、- 及 _ ',
            default: 'matman-app',
            validate: function (projectName) {
                if (!projectName) {
                    return '项目名称不能为空';
                }

                // 默认情况下是在当前路径下新建以 projectName 为名字的文件夹，然后再进入其中生成代码。
                // 但如果当前路径下已经存在了，则需要进行提示，避免覆盖
                if (!isDev && fse.pathExistsSync(path.resolve(projectName))) {
                    return `当前目录下已经存在名字为 ${projectName} 的文件夹了`;
                }

                return true;
            }
        }]).then((answers) => {
            this.answers = answers;

            this.projectConfig.updateByAnswer(this.answers);
        });
    }

    /**
     * Generator project files.
     */
    writing() {
        const { projectName } = this.projectConfig;

        const _copyTemplates = () => {
            const folderPath = path.resolve(projectName);

            // 默认情况下是在当前路径下新建以 projectName 为名字的文件夹，然后再进入其中生成代码。
            // 但如果当前路径下已经存在了，则需要进行提示。
            mkdirp(folderPath);
            shell.cd(folderPath);

            this.destinationRoot(this.destinationPath(folderPath));

            this.fs.copyTpl(
                this.templatePath('_package'),
                this.destinationPath('package.json'),
                {
                    projectConfig: this.projectConfig
                }
            );

            this.fs.copy(
                this.templatePath('gitignore'),
                this.destinationPath('.gitignore')
            );

            this.fs.copy(
                this.templatePath('gitattributes'),
                this.destinationPath('.gitattributes')
            );

            this.fs.copyTpl(
                this.templatePath('_README'),
                this.destinationPath('README.md'),
                {
                    projectConfig: this.projectConfig
                }
            );

            this.fs.copy(
                this.templatePath('matman.config.js'),
                this.destinationPath('matman.config.js')
            );

            const demoTesterName = 'demo_tester';

            const testerConfig = new TesterConfig({
                testerParentPath: path.join(this.destinationPath(), './src/testers'),
                testerName: demoTesterName,
                testerMain: '#container',
                testerUrl: 'https://now.qq.com/mobile.html',
                testerCmd: "it('下载按钮文案', function () {expect(data.btntext).to.be.equal('立即下载');});",
                testerGet: "result.btntext = useJquery.getText('#container .download-btn');",
            });

            ['src'].forEach((curFile) => {
                this.fs.copy(
                    this.templatePath(curFile),
                    this.destinationPath(curFile)
                );
            });

            this.fs.copyTpl(
                path.join(this.templatePath(), '../../tester/templates/crawlers/_get-page-info'),
                path.join(testerConfig.testerParentPath, demoTesterName, 'crawlers/get-page-info.js'),
                {
                    testConfig: testerConfig
                }
            );

            this.fs.copyTpl(
                path.join(this.templatePath(), '../../tester/templates/env/_index'),
                path.join(testerConfig.testerParentPath, demoTesterName, 'env/index.js'),
                {
                    testConfig: testerConfig
                }
            );

            this.fs.copyTpl(
                path.join(this.templatePath(), '../../tester/templates/cases/basic-check/_index'),
                path.join(testerConfig.testerParentPath, demoTesterName, 'cases/basic-check/index.js'),
                {
                    testConfig: testerConfig
                }
            );

            this.fs.copyTpl(
                path.join(this.templatePath(), '../../tester/templates/cases/basic-check/_index.test'),
                path.join(testerConfig.testerParentPath, demoTesterName, 'cases/basic-check/index.test.js'),
                {
                    testConfig: testerConfig
                }
            );

        };

        _copyTemplates();
    }

    install() {
        logger.info('项目初始化完成');
    }

    end() {
        logger.info(`本次初始化过程结束。接下来请继续执行以下命令完成安装：\n\t cd ${this.projectConfig.projectName} && npm install。`);
    }
};
