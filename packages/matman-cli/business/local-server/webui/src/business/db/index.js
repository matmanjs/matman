import superagent from 'superagent';
import matmanStubAsync from 'matman-stub-async';

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
  let asyncClient = new matmanStubAsync.AsyncClient(url);

  // TODO 这里需要考虑下超时的情形
  return asyncClient.request(route, params);
}
