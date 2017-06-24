const _ = require('lodash');
const request = require('request');
const Promise = require('bluebird');
const querystring = require('querystring');

/**
 * 在mock module中进行请求
 *
 * @param req
 * @param {Object} params 请求参数
 * @param {Object} requestOpts request组件的opts参数
 * @return {Promise}
 */
function requestInMock(req, params, requestOpts) {
  return new Promise((resolve, reject) => {
    const defaultRequestOpts = {
      url: 'http://' + req.headers.host + req.url,
      headers: req.headers,
      method: req.method,
      jar: true,
      timeout: 4000
    };

    // 如果服务器返回的是 gzip 内容，则需要设置 gzip=true

    let opts;

    if (req.method === 'GET') {
      let requestOptsQs = requestOpts.qs;

      // 移除这个字段，避免又被干扰
      delete requestOpts.qs;

      opts = _.merge({}, defaultRequestOpts, {
        qs: _.merge({}, req.query, params, requestOptsQs)
      }, requestOpts);
    } else if (req.method === 'POST') {
      let requestOptsForm = requestOpts.form;

      // 移除form这个字段，避免又被干扰
      delete requestOpts.form;

      let formValue = _.merge({ _m_from: 2 }, req.body, params, requestOptsForm);

      let formValueStr = querystring.stringify(formValue);

      let requestOptsHeaders = requestOpts.headers;

      // 移除headers这个字段，避免又被干扰
      delete requestOpts.headers;

      // 由于修改了 data，则需要重新设置 content-length 的值
      let headersValue = _.merge({}, req.headers, {
        "content-length": Buffer.byteLength(formValueStr)
      }, requestOptsHeaders);

      opts = _.merge({}, defaultRequestOpts, {
        form: formValue,
        headers: headersValue,
      }, requestOpts);
    } else {
      opts = _.merge({}, defaultRequestOpts, requestOpts);
    }

    // 自带一个这个参数，避免循环调用
    opts.qs = _.merge({}, opts.qs, { _m_from: 2 });

    // console.log('opts:', opts);

    request(opts, function (error, response, body) {
      // console.log('error:', error);
      // console.log('statusCode:', response && response.statusCode);
      // console.log('body:', body);

      if (error) {
        return reject(error);
      }

      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
  });
}

module.exports = {
  requestInMock: requestInMock,
};