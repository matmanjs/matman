import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import glob from 'glob';

import CrawlerParser from '../model/CrawlerParser';
import { getWebpackConfig, runBuild } from './builder-webpack3';

/**
 * 构建
 *
 * @param {Object} config config文件内容
 * @return {Object}
 */
export default function build(config) {
    const crawlerParser = new CrawlerParser(config);

    // TODO 校验 crawlerParser 参数合法性

    const isDevBuild = crawlerParser.isDevBuild;

    // 获得 webpack 构建选项
    getWebpackConfig(crawlerParser)
        .then((webpackConfig) => {

            // 获取到 webpack 配置项结果
            console.log('webpackConfig: \n', webpackConfig);

            // 执行构建
            runBuild(webpackConfig, () => {
                let prependCodePromiseList = [];
                let evalList = [];

                // 如果是非简单模式下，则为打包之后的文件手动增加 nightmare client script
                if (!isDevBuild) {
                    prependCodePromiseList.push(getNightmareClientCode());

                    // 插入 jQuery
                    prependCodePromiseList.push(getJqueryCode('jQueryCode'));
                    evalList.push('jQueryCode');
                } else {
                    prependCodePromiseList.push(getDevPrependCode());
                }

                // 获得所有的代码之后，追加在头部
                if (prependCodePromiseList.length) {
                    Promise.all(prependCodePromiseList)
                        .then((result) => {
                            result.push(`window.evalList=[${evalList.map(item => `"${item}"`).join(',')}]`);

                            // 每段插入的代码之后，注意要加一个换行符号，否则在支持 source map 之后，可能会被其"注释"掉
                            prependCodeToDistFile(crawlerParser.crawlerBuildPath, result.join(';\n'));
                        });
                }

                // 构建完成之后保存一份配置到构建目录中
                saveWebpackConfig(crawlerParser.crawlerBuildPath, webpackConfig);

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

function getDevPrependCode() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, './builder-webpack3/libs/dev-prepend.js'), 'utf8', (err, data) => {
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

function prependCodeToDistFile(crawlerScriptBuildPath, code) {
    let globResult = glob.sync(path.resolve(crawlerScriptBuildPath, './**/**.js'));

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