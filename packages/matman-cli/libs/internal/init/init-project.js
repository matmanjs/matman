'use strict';

const path = require('path');
const yeoman = require('yeoman-environment');
const yeomanEnv = yeoman.createEnv();
const Promise = require('bluebird');

/**
 * 初始化一个 mocker
 */
module.exports = function (opts) {
  const name = 'project';

  const pkgVersion = {
    Matman: 'unknown',
  };

  // generator 的目录
  const generatorPath = path.join(__dirname, '../../../biz/generators', name);

  yeomanEnv.register(require.resolve(generatorPath), name);

  return new Promise((resolve, reject) => {
    // 可以通过透传额外参数到 generator 中，然后通过 this.options 就能够取到传递过去的值
    let yeoResult = yeomanEnv.run(
      name,
      {
        pkgVersion: pkgVersion,
        isDev: opts.dev,
      },
      err => {
        // console.log('=====end===', err);
        // 这里的 yeoResult 即 generator 的 this 对象，例如可以通过 result.destinationPath() 获得生成的地址
        if (err) {
          console.error('yeoman generator err', generatorPath, err);
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
};
