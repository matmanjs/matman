const fs = require('fs');
const path = require('path');
const fsHandler = require('fs-handler');
const urlParse = require('url-parse');

function readFiles(root, filter, files, prefix) {
    prefix = prefix || '';
    files = files || [];
    filter = filter || noDotFiles;

    const dir = path.join(root, prefix);

    if (!fs.existsSync(dir)) {
        return files;
    }

    if (fs.statSync(dir).isDirectory()) {
        fs.readdirSync(dir)
            .filter(filter)
            .forEach(function (name) {
                readFiles(root, filter, files, path.join(prefix, name));
            });
    } else {
        files.push(prefix);
    }

    return files;
}

/**
 * 获得某个路径下的所有 mock_server 目录
 * @param {String} rootPath 根目录
 * @return {Array}
 */
function getMockServerPathList(rootPath) {
    let list = [];

    fsHandler.search.getAll(rootPath, { globs: ['**/matman.config.js'] }).forEach((item) => {
        let opts = require(path.join(item.basePath, item.relativePath));

        list.push(opts.mockServerPath || path.join(opts.rootPath, 'src/testers'));
    });

    return list;
}

function noDotFiles(x) {
    return x[0] !== '.';
}

function formatDate(fmt, date) {
    const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }

    return fmt;
}

function getMockerNameFromURL(url) {
    const urlParseResult = urlParse(url);
    // return urlParseResult.pathname.replace(/[\/|.]/g,'_');
    let resultarr = urlParseResult.pathname.split('/');
    resultarr.pop();
    return resultarr.pop().replace(/[\/|.]/g, '_');
}

module.exports = {
    readFiles: readFiles,
    formatDate: formatDate,
    getMockServerPathList: getMockServerPathList,
    getMockerNameFromURL: getMockerNameFromURL
};
