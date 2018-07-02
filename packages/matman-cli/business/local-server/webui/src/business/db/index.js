import superagent from 'superagent';

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