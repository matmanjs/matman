import path from 'path';

/**
 * require mocker module 文件，并将结果返回
 * @param {String} filePath 文件路径
 * @param {String} [fileName] 文件名
 * @return {Object}
 */
export default function requireMockerModule(filePath, fileName) {
    let result;

    if (fileName) {
        result = require(path.join(filePath, fileName));
    } else {
        result = require(filePath);
    }

    // 如果是es6写法 export default xxx，则编译之后的值会存储在result.default中
    // 因此在这种情况下实际返回的时候，只需要返回 result.default 即可
    if (typeof result.default !== 'undefined') {
        result = result.default;
    }

    return result;
};