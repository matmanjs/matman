'use strict';

const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const glob = require('glob');

const builderWebpack3 = require('./builder-webpack3');

module.exports = function (args) {
  // console.log(args);

  let isDevBuild = !!args.dev;

  // 编译 client src
  builderWebpack3.getWebpackConfig(null, isDevBuild)
    .then((webpackConfig) => {

      // 获取到 webpack 配置项结果
      console.log('webpackConfig: \n', webpackConfig);

      // return;
      let configParams = webpackConfig._configParams;
      let clientScriptHandler = webpackConfig._clientScriptHandler;

      builderWebpack3.runBuild(webpackConfig, () => {
        let prependCodePromiseList = [];
        let evalList = [];

        // 如果是非简单模式下，则为打包之后的文件手动增加 nightmare client script
        if (!isDevBuild) {
          prependCodePromiseList.push(getNightmareClientCode());
        }

        // 插入 jQuery
        prependCodePromiseList.push(getJqueryCode('jQueryCode'));
        evalList.push('jQueryCode');

        // 获得所有的代码之后，追加在头部
        if (prependCodePromiseList.length) {
          Promise.all(prependCodePromiseList)
            .then((result) => {
              result.push(`window.evalList=[${evalList.map(item => `"${item}"`).join(',')}]`);

              if (isDevBuild) {
                result.push(`
                                    if (window.evalList && window.evalList.length) {
                                        window.evalList.forEach((item) => {
                                            eval(window[item]);
                                        });
                                    }
                                `);
              }

              prependCodeToDistFile(clientScriptHandler.buildPath, result.join(';'));
            });
        }

        // 保存一份配置到本地
        saveWebpackConfig(clientScriptHandler.buildPath, webpackConfig);

      });
    })
    .catch((err) => {
      throw err;
    });
};

function getNightmareClientCode() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, './builder-webpack3/libs/nightmare-preload.js'), 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(data);
    });
  });
}

function getJqueryCode(key) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, './builder-webpack3/libs/jquery.slim.min.js'), 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }

      // 必须通过定义变量的方式插入，后续再执行
      resolve(getRawCodeToPrepend(key, data));
    });
  });
}

function prependCodeToDistFile(clientScriptBuildPath, code) {
  let globResult = glob.sync(path.resolve(clientScriptBuildPath, './**/**.js'));

  globResult.forEach((item) => {
    // console.log(item);

    fs.readFile(item, 'utf8', (err, data) => {
      if (err) {
        console.log('read file err!', item, err);
        return;
      }

      fse.outputFile(item, code + ';' + data, err => {
        if (err) {
          console.error('prepend fail!', item, err);
        } else {
          console.log('prepend success!', item);
        }
      });
    });
  });
}

function getRawCodeToPrepend(key, source) {
  let rawCode = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  return `window.${key}=${rawCode};`;
}

function saveWebpackConfig(basePath, data) {
  // 必须要保证这个目录存在，否则构建时可能报错
  fse.ensureDirSync(basePath);

  fse.writeJsonSync(path.join(basePath, './webpack-config.json'), data);
}