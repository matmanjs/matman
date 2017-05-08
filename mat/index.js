import superagent from 'superagent';
import Promise from 'bluebird';

//http://now.qq.com/cgi-bin/now/web/user/get_personal_live_rcmd_read?num=19&tab_id=2&friend_label=0&bkn=1230314046&_=0.8230356849607838
// superagent.get('http://now.qq.com/cgi-bin/now/web/user/get_personal_live_rcmd_read')
//     .query({
//         num: 2,
//         tab_id: 2
//     })
//     .end((err, res) => {
//         console.log('end', err, res.body)
//     });

function getResult() {
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

console.log(typeof getResult, typeof getResult.then)
console.log(typeof getResult(), typeof getResult().then)

// getResult()
//     .then((data) => {
//         console.log('then', data);
//     })
//     .catch((err) => {
//         console.log('catch', err);
//     });