import superagent from 'superagent';
import Promise from 'bluebird';

export default function getResult() {
    return new Promise((resolve, reject) => {
        superagent.get('http://now.qq.com/cgi-bin/now/web/user/get_personal_live_rcmd_read')
            .query({
                num: 2,
                tab_id: 2
            })
            .withCredentials()
            .end((err, res) => {
                if (err) {
                    return reject(err);
                }

                resolve(res.body);
            });
    })
}

// getResult()
//     .then((data) => {
//         console.log('then', data);
//     })
//     .catch((err) => {
//         console.log('catch', err);
//     });