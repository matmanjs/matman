import superagent from 'superagent';
import StubAsyncClient from './stub-async-client';

export function ajax(opts = {}) {
  if (opts.method === 'post') {
    return getDataByPost(opts.url, opts.data);
  } else {
    return getDataByGet(opts.url, opts.data);
  }
}

export function getDataByPost(url, queryOpts) {
  return new Promise((resolve, reject) => {
    superagent.post(url)
      .set('Content-Type', 'application/json')
      .send(queryOpts)
      // .withCredentials()
      .end((err, res) => {
        if (err) {
          return reject(err);
        }

        resolve(res.body);
      });
  });
}

export function getDataByGet(url, queryOpts) {
  return new Promise((resolve, reject) => {
    superagent.get(url)
      .query(queryOpts)
      // .withCredentials()
      .end((err, res) => {
        if (err) {
          return reject(err);
        }

        resolve(res.body);
      });
  });
}

export function requestStub(url, route, params = {}) {
  return new Promise((resolve, reject) => {
    let stub = new StubAsyncClient(url);

    // TODO 这里需要考虑下超时的情形
    stub.emit(route, params, (data) => {
      resolve(data);
    });
  });

}
