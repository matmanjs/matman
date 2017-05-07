import fseExtra from 'fs-extra';
import Promise from 'bluebird';

const fse = Promise.promisifyAll(fseExtra);

/**
 * 将json对象保存为json文件。
 *
 * @param {Object} jsonObj 要保存的json对象
 * @param {String} savePath 保存路径
 * @return {Promise}
 */
export function saveJson(jsonObj, savePath) {
    return new Promise((resolve, reject) => {
        fse.outputJsonAsync(savePath, jsonObj)
            .then(() => {
                resolve(jsonObj);
            })
            .catch((err) => {
                reject(err);
            });
    });
}