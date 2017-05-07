import fseExtra from 'fs-extra';
import Promise from 'bluebird';

const fse = Promise.promisifyAll(fseExtra);

/**
 * 将json对象或者Promise对象保存为json文件。
 *
 * @param {Object | Function | Promise} saveTarget 要保存的对象
 * @param {String} savePath 保存路径
 * @return {Promise}
 */
export function saveJson(saveTarget, savePath) {
    return new Promise((resolve, reject) => {
        getSaveObj(saveTarget)
            .then((data) => {
                fse.outputJsonAsync(savePath, data)
                    .then(() => {
                        resolve(data);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            })
            .catch((err) => {
                reject(err);
            });
    });
}

/**
 * 获得要保存的json对象的Promise
 *
 * @param {Object | Function | Promise} saveTarget 要保存的对象
 * @return {Promise}
 */
function getSaveObj(saveTarget) {
    return new Promise((resolve, reject) => {
        if (typeof saveTarget === 'function') {
            // 如果传入的是方法，则执行方法
            let saveObj = saveTarget();

            if (isPromiseObj(saveObj)) {
                // 获得了方法执行的结果之后，判断返回的为 Promise 的话则获取最终结果值
                saveObj
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            } else {
                // 如果方法返回的是普通对象，则直接返回
                resolve(saveObj);
            }
        } else if (isPromiseObj(saveTarget)) {
            // 如果传入的为 Promise 的话则获取最终结果值
            saveTarget
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                });
        } else {
            // 如果传入的是普通对象，则直接返回
            resolve(saveTarget);
        }
    });
}

/**
 * 判断是否为 Promise 对象值，这种判断方式大部分情况下是没问题的
 *
 * @param {Object} obj 对象
 * @return {Boolean}
 */
function isPromiseObj(obj) {
    return obj && (typeof obj.then === 'function');
}