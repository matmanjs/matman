import path from 'path';

/**
 * require 文件，并将结果返回
 * @param {String} filePath 文件路径
 * @param {String} [fileName] 文件名
 * @return {Object}
 */
export default function requireFile(filePath, fileName) {
    let result;

    if (fileName) {
        result = require(path.join(filePath, fileName));
    } else {
        result = require(filePath);
    }

    // 如果是es6写法 export default xxx，则编译之后的值会存储在result.default中
    if (typeof result.default !== 'undefined') {
        result = result.default;
    }

    return result;
};