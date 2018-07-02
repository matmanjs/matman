'use strict';

const path = require('path');
const Promise = require('bluebird');
const matmanCore = require('matman-core');
const fse = require('fs-extra');
const inquirer = require('inquirer');

module.exports = function (args) {
  // node ./bin/matman build-handler xx/yy zz/ww --a=11 --b=3a
  // { _: [ 'xx/yy', 'zz/ww' ], a: 11, b: '3a' }
  // console.log(args);

  // 必须要传入 srcPath 和 disPath，且顺序不能交换
  let pArr = args._;
  if (!pArr || pArr.length < 2) {
    console.error('Please check the cmd: build-handler <srcPath> <distPath> [-sa]');
    process.exit(1);
  }

  let srcPath = path.resolve(pArr[0]);
  let distPath = path.resolve(pArr[1]);
  let isSilent = args.s;
  let isOverride = args.a;

  // 如果 srcPath 不存在，则进行提示
  if (!fse.pathExistsSync(srcPath)) {
    console.error('The path is not exist: ' + srcPath);
    process.exit(1);
  }

  let isExistDistPath = fse.pathExistsSync(distPath);
  let msg = isExistDistPath ? `已存在 ${distPath}，是否覆盖？` : `确定在 ${distPath} 生成构建结果？`;

  return new Promise((resolve, reject) => {
    // 如果是覆盖模式，则直接覆盖
    if (isOverride) {
      return resolve('无论本地是否存在该路径，直接覆盖');
    }

    // 如果是静默模式，且本地已经存在，则不覆盖，不存在则生成
    if (isSilent) {
      return isExistDistPath ? reject('静默构建场景，本地已存在该路径，放弃') : resolve('静默构建场景，本地不存在该路径');
    }

    // 其他情况需要询问下用户
    inquirer.prompt([{
      type: 'confirm',
      name: 'isOveride',
      message: msg
    }])
      .then((answer) => {
        answer.isOveride ? resolve('用户主动确认') : reject('用户主动取消');
      })
      .catch((err) => {
        reject(err);
      });
  })
    .then((data) => {
      console.log(`准备构建（${data}）`);

      matmanCore.serialize(srcPath, distPath, args);

      // return data;
    })
    .catch((err) => {
      console.log(`取消构建（${err}）`);
      // return Promise.reject(err);
    });
};
