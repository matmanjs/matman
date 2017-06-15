const path = require('path');
const fse = require('../util/fse');

/**
 * 通过文件路径，将 mocker_modules 模块的结果保存为json文件。
 *
 * @param {String} srcPath 源文件的路径
 * @param {String} savePath 保存路径
 * @return {Promise}
 */
function save(srcPath, savePath) {
  return new Promise((resolve, reject) => {
    getResult(srcPath)
      .then((saveData) => {
        saveJSON(saveData, savePath)
          .then((data) => {
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
 * 将 JSON 格式的对象保存为json文件。
 *
 * @param {Object} data 对象，plain object
 * @param {String} savePath 保存路径
 * @return {Promise}
 */
function saveJSON(data, savePath) {
  return new Promise((resolve, reject) => {
    fse.outputJsonAsync(path.resolve(savePath), data)
      .then(() => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * 通过文件路径获得将 mocker_modules 模块的结果对象
 *
 * @param {String} filePath 文件路径
 *
 * @return {Promise}
 */
function getResult(filePath) {
  return new Promise((resolve, reject) => {
    /**
     * require mocker modules 之后的对象
     * @type {Object | Function | Promise}
     */
    let saveTarget = requireModule(filePath);

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
 * require mocker module 文件，并将结果返回
 *
 * @param {String} filePath 文件路径
 * @return {Object}
 */
function requireModule(filePath) {
  let result = require(path.resolve(filePath));

  // 如果是es6写法 export default xxx，则编译之后的值会存储在result.default中
  // 因此在这种情况下实际返回的时候，只需要返回 result.default 即可
  if (typeof result.default !== 'undefined') {
    result = result.default;
  }

  return result;
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

module.exports = {
  save: save,
  saveJSON: saveJSON,
  getResult: getResult
};