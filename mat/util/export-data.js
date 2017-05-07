var Promise = require('bluebird');
var fse = Promise.promisifyAll(require('fs-extra'));

/**
 * 将mock源文件执行，且将结果保存为json文件。
 *
 * @param {Object} jsonObj 要保存的json对象
 * @param {String} savePath 保存路径
 * @return {Promise}
 */
function saveAsJson(jsonObj, savePath) {
    return new Promise(function (resolve, reject) {
        fse.outputJsonAsync(savePath, jsonObj)
            .then(function () {
                resolve(jsonObj);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

module.exports = {
    saveAsJson: saveAsJson
};