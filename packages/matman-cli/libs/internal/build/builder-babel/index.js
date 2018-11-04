const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const babelD = require('babel-d');
const utils = require('../utils');

/**
 *
 * @return {Promise}
 */
function getBabelConfig() {
    return utils.getConfig();
}

function runBuild(srcPath, distPath, options = {}) {
    if (options.debug) {
        console.log('\nBegin build...', srcPath, distPath, options);
    }

    // 必须要保证这个目录存在，否则构建时可能报错
    fse.ensureDirSync(distPath);

    //===============================================================
    // 把所有的文件都 babel 转义
    //===============================================================
    babelD(srcPath, distPath, { debug: options.debug });

    let code = `
        export function getScript(name) {
            let webpackConfig = require('./webpack-config');
            let _path = require('path');
    
            return _path.join(webpackConfig.output.path, webpackConfig.output.filename.replace(/\\[name\\]/, name));
        }
    `;

    //===============================================================
    // 追加部分代码之后再重新处理 index.js
    //===============================================================
    if (options.debug) {
        console.log('deal index.js...');
    }

    fs.readFile(path.join(srcPath, 'index.js'), 'utf8', (err, content) => {
        if (err) {
            console.log('read file err!', err);
            return;
        }

        // 将新的代码进行编译并保存
        let data = babelD.babelCompile.compileByBabel(content + code);
        fse.outputFileSync(path.join(distPath, 'index.js'), data.code);
    });

    if (options.debug) {
        console.log('Build end!\n');
    }

}

module.exports = {
    getBabelConfig: getBabelConfig,
    runBuild: runBuild
};