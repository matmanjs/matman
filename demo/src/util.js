import Promise from 'bluebird';
import _ from 'lodash';

/**
 * 获得CGI成功时返回的信息
 * @param {Object | Promise} data CGI实际的数据
 * @param {Object} [defaultData] 默认的合并的数据
 * @returns {Promise}
 */
export function getCgiSuccess(data, defaultData) {
    return new Promise((resolve, reject) => {
        getData(data)
            .then((resultData) => {
                resolve({
                    'retcode': 0,
                    'result': _.merge({}, defaultData, resultData)
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
}

/**
 * 获得CGI异常和失败时返回的信息
 * @param {Number | Promise} errCode 错误码
 * @param {String} [errMsg] 错误信息
 * @returns {Promise}
 */
export function getCgiFail(errCode, errMsg) {
    return new Promise((resolve, reject) => {
        getData(errCode)
            .then((resultCode) => {
                let obj = {
                    'retcode': resultCode,
                };

                if (errMsg) {
                    obj.msg = errMsg;
                }

                resolve(obj);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

/**
 * 判断是否为 Promise 对象值，这种判断方式大部分情况下是没问题的
 *
 * @param {Object} obj 对象
 * @return {Boolean}
 */
export function isPromiseObj(obj) {
    return obj && (typeof obj.then === 'function');
}

/**
 * 获取真正的数据
 * @param {* | Promise} data
 */
function getData(data) {
    return new Promise((resolve, reject) => {
        if (isPromiseObj(data)) {
            data
                .then((resultData) => {
                    resolve(resultData);
                })
                .catch((err) => {
                    reject(err);
                });
        } else {
            resolve(data);
        }
    });
}