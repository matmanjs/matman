var Promise = require('bluebird');
var fse = Promise.promisifyAll(require('fs-extra'));

/**
 * 将json对象保存为json文件。
 *
 * @param {Object} jsonObj 要保存的json对象
 * @param {String} savePath 保存路径
 * @return {Promise}
 */
function saveJson(jsonObj, savePath) {
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
    saveJson: saveJson
};