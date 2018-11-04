'use strict';

const path = require('path');
const yeoman = require('yeoman-environment');
const yeomanEnv = yeoman.createEnv();

const Promise = require('bluebird');
const fse = require('fs-extra');

module.exports = function (args) {
  // console.log(args);

  // 当前 matman-cli 工具的版本
  let matmanCliVersion = this.version;

  // 必须要传入 srcPath
  let pArr = args._;
  if (!pArr || pArr.length < 1) {
    console.error('Please check the cmd: build <srcPath>');
    process.exit(1);
  }

  let srcPath = path.resolve(pArr[0]);

  // 如果 srcPath 不存在，则进行提示
  if (!fse.pathExistsSync(srcPath)) {
    console.error('The path is not exist: ' + srcPath);
    process.exit(1);
  }

  let name = 'npm-package';

  let generatorPath = path.resolve(__dirname, '../../generators/' + name);

  yeomanEnv.register(require.resolve(generatorPath), name);

  // 可以通过透传额外参数到 generator 中，然后通过 this.options 就能够取到传递过去的值
  let yeoResult = yeomanEnv.run(name, {
    'skip-install': true,
    'srcPath': srcPath,
    'matmanCliVersion': matmanCliVersion
  }, err => {
    // console.log('=====end===', err);
    // 这里的 yeoResult 即 generator 的 this 对象，例如可以通过 result.destinationPath() 获得生成的地址
  });

  return Promise.resolve();
};
