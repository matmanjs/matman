'use strict';

const path = require('path');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const Generator = require('yeoman-generator');
const shell = require('shelljs');
const Validate = require('./validate');
const Utils = require('./utils');
const Loading = require('./loading');
const logger = require('./logger');
const matmanCore = require('matman-core');
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
        `\n欢迎使用基于 matman 的自助构建 npm 包的功能！\n`
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
      message: '请输入项目名称，只能够输入英文、数字和、- 及 _ ：',
      default: 'matman-mocker-xxx'
    }, {
      type: 'input',
      name: 'description',
      message: '请输入项目描述信息：'
    }, {
      type: 'input',
      name: 'version',
      message: '请输入版本 (1.0.0)：',
      default: '1.0.0'
    }]).then((answers) => {
      this.answers = answers;
    });
  }

  /**
   * Validate developer input message.
   */
  validate() {
    const { name } = this.answers;

    log.info('即将开始校验输入的项目基本信息');

    if (!name) {
      log.info(`项目名称不能够为空！\n`);
      return this.prompting();
    }

    // 默认情况下是在当前路径下新建以 name 为名字的文件夹，然后再进入其中生成代码。
    // 但如果当前路径下已经存在了，则需要进行提示，避免覆盖
    if (fse.pathExistsSync(name)) {
      log.info(`当前目录下已经存在名字为 ${name} 的文件夹了，请到其他目录运行命令或者修改项目名字。\n`);
      return this.prompting();
    }

    log.info('校验通过，即将在本地生成代码');
  }

  /**
   * Generator project files.
   */
  writing() {
    const { name, description, version } = this.answers;

    const _copyTemplates = () => {
      // 默认情况下是在当前路径下新建以 name 为名字的文件夹，然后再进入其中生成代码。
      // 但如果当前路径下已经存在了，则需要进行提示。
      mkdirp(name);

      shell.cd(name);

      this.destinationRoot(this.destinationPath(name));

      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          name: name,
          description: description,
          version: version,
          matmanCliVersion: this.options.matmanCliVersion
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
          name: name,
          description: description
        }
      );

      // copy source code to src folder
      const srcPath = this.options.srcPath;
      const filePaths = Utils.read(srcPath);

      filePaths.map((filePath) => {
        this.fs.copy(
          path.join(srcPath, filePath),
          this.destinationPath('./src/' + filePath)
        );
      });

    };

    _copyTemplates();
  }

  install() {
    log.info('项目初始化完成, 即将进行构建处理');

    const loading = new Loading('构建中...');

    matmanCore.serialize(this.options.srcPath, this.destinationPath('lib'));

    loading.success();

    log.info('构建完成');
  }

  end() {
    log.info('本次初始化过程结束');
  }
};
