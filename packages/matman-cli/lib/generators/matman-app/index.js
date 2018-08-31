'use strict';

const path = require('path');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const Generator = require('yeoman-generator');
const shell = require('shelljs');
const Utils = require('./utils');
const logger = require('./logger');
const fse = require('fs-extra');

const log = logger({});

module.exports = class extends Generator {

  constructor(...args) {
    super(...args);

    this.answers = {};
  }

  /**
   * Show template basic message.
   */
  initializing() {
    this.log(
      chalk.magenta(
        `\n欢迎使用 matman app 脚手架！\n`
      )
    );
  }

  /**
   * Interact with developer.
   */
  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'name',
      message: '请输入项目名称，只能够输入英文、数字和、- 及 _ ',
      default: 'matman-app',
      validate: function (name) {
        if (!name) {
          return '项目名称不能为空';
        }

        // 默认情况下是在当前路径下新建以 name 为名字的文件夹，然后再进入其中生成代码。
        // 但如果当前路径下已经存在了，则需要进行提示，避免覆盖
        if (fse.pathExistsSync(name)) {
          return `当前目录下已经存在名字为 ${name} 的文件夹了`;
        }

        return true;
      }
    }]).then((answers) => {
      this.answers = answers;
    });
  }

  /**
   * Generator project files.
   */
  writing() {
    const { name } = this.answers;

    const folderPath = path.resolve(name);

    const _copyTemplates = () => {
      // 默认情况下是在当前路径下新建以 name 为名字的文件夹，然后再进入其中生成代码。
      // 但如果当前路径下已经存在了，则需要进行提示。
      mkdirp(folderPath);
      shell.cd(folderPath);

      this.destinationRoot(this.destinationPath(folderPath));

      this.fs.copyTpl(
        this.templatePath('_package'),
        this.destinationPath('package.json'),
        {
          name: name,
          pkgVersion: this.options.pkgVersion
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
        this.templatePath('_README.md'),
        this.destinationPath('README.md'),
        {
          name: name
        }
      );

      this.fs.copy(
        this.templatePath('matman.config.js'),
        this.destinationPath('matman.config.js')
      );

      // copy src dir
      // const sourceDir = path.join(this.templatePath(), './src/');
      // const filePaths = Utils.read(sourceDir);
      //
      // filePaths.map((filePath) => {
      //   this.fs.copy(
      //     this.templatePath('./src/' + filePath),
      //     this.destinationPath('./src/' + filePath)
      //   );
      // });

    };

    _copyTemplates();
  }

  install() {
    log.info('项目初始化完成');
  }

  end() {
    log.info(`本次初始化过程结束。接下来请继续执行以下命令完成安装：\n\t cd ${this.answers.name} && npm install。`);
  }
};
