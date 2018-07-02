import request from 'superagent';

const STATUS = 'storeStatus';

export const CALL_API = 'Call API';

export default store => next => action => {
    /**
     * opts 字段说明：
     *  url: CGI请求地址
     *  types: action的type值数组，按顺序依次代表: requestType, successType, failureType
     *  type: ajax的类型，get或者post
     *  data: 请求的参数对象
     *
     * @type {{url:String, types:String[], type:String, data:Object}}
     */
    const opts = action[CALL_API];

    if (typeof opts === 'undefined') {
        return next(action);
    }

    // 二次处理请求的opts中的参数
    const { type } = opts,
        [requestType, successType, failureType] = opts.types;

    opts.type = type ? type : 'GET';

    /**
     * 触发action
     * @param {Object} _action
     * @returns {*}
     */
    function actionWith(_action) {
        _action = Object.assign(action, _action);

        //'wait' 'fetching' 'success' 'fail'
        let obj = {
            [STATUS]: 'fetching'
        };

        switch (_action.type) {
            case successType:
                obj[STATUS] = 'success';
                break;
            case failureType:
                obj[STATUS] = 'fail';
        }

        if (obj[STATUS] !== 'fetching') {
            _action.data = Object.assign(_action.data || {}, obj);
        } else {
            _action.data = {};
        }

        const finalAction = _action;

        delete finalAction[CALL_API];

        return finalAction;
    }

    // 在请求发送之前，首先会触发 request 的action，表示要发送请求了
    let data = Object.assign({}, opts.data);

    next(actionWith({
        type: requestType,
        data
    }));

    // TODO 开发模式下暂时写死端口
    let requestURL = opts.url;
    if (process.env.NODE_ENV !== 'production') {
        requestURL = 'http://localhost:9527' + requestURL;
    }

    // 发送 ajax 请求
    return request(opts.type, requestURL)
        .send(opts.data)
        .then((res) => {
            return res.body || {};
        })
        .then((resData) => {
            let finalAction = actionWith({
                type: successType,
                data: resData
            });

            next(finalAction);

            if (typeof opts._onSuccess === 'function') {
                opts._onSuccess(resData, next);
            }

            return finalAction;
        })
        .catch((err) => {
            // ios8下面 stack会存在
            if (err && err.stack && !err.errno) {
                // error
                setTimeout(function () {
                    throw err;
                }, 0);
            } else {
                let finalAction = actionWith({
                    type: failureType,
                    error: err
                });

                next(finalAction);

                if (typeof opts._onFail === 'function') {
                    opts._onFail(err, next);
                }

                return Promise.reject(finalAction);
            }
        });
}
