const fs = require('fs');
const path = require('path');
const runCmd = require('./run-cmd');

const exec = require('child_process').exec;

function checkIfWhistleStarted() {
    return new Promise((resolve, reject) => {
        exec('w2 status', function (error, stdout, stderr) {
            if (error) {
                return reject(error);
            }

            const matchResult = stdout.match(/127\.0\.0\.1:([0-9]+)\//i);
            if (matchResult && matchResult[1]) {
                resolve(matchResult[1]);
            } else {
                reject(stdout);
            }
        });
    });
}

function startWhistleDirect() {
    return new Promise((resolve, reject) => {
        exec('w2 start', function (error, stdout, stderr) {
            if (error) {
                return reject(error);
            }

            const matchResult = stdout.match(/127\.0\.0\.1:([0-9]+)\//i);
            if (matchResult && matchResult[1]) {
                resolve(matchResult[1]);
            } else {
                reject(stdout);
            }
        });
    });
}

function startWhistle() {
    return checkIfWhistleStarted()
        .then((port) => {
            console.log(`whistle 已经启动，端口为 ${port}`);
            return port;
        })
        .catch((err) => {
            console.error('whistle 没有启动：', err);
            return startWhistleDirect()
                .then((port) => {
                    console.log(`whistle 启动成功，端口为 ${port}`);
                    return port;
                })
                .catch((err) => {
                    console.error('whistle 启动失败：', err);
                    return Promise.reject(err);
                });
        });
}

module.exports = {
    startWhistle
};

