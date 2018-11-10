'use strict';

const fs = require('hexo-fs');
const Promise = require('bluebird');

/**
 * Init matman client, including ~/.matman, ~/.matman/package.json, ~/.matman/.matmanrc.yml
 */
class Client {
    constructor(ctx) {
        this.ctx = ctx;
        this.log = ctx.log;
    }

    initHome() {
        const ctx = this.ctx;
        const { baseDir, log } = ctx;

        return new Promise(function (resolve) {
            if (fs.existsSync(baseDir) && fs.statSync(baseDir).isFile()) {
                fs.unlinkSync(baseDir);
            }

            fs.ensurePathSync(baseDir);
            // 注意 fs.existsSync('.matman/') 与 fs.existsSync('.matman') 结果不一样
            // if (!fs.existsSync(baseDir)) {
            //   log.info('检测到这是您第一次使用matman，即将进行cli client初始化');
            //
            //   fs.mkdirsSync(baseDir);
            // }

            log.debug('.matman 目录已经创建');
            resolve(ctx);
        });
    }

    initPkg() {
        const ctx = this.ctx;
        const { pkgPath, log } = ctx;

        return new Promise(function (resolve) {
            if (!fs.existsSync(pkgPath)) {
                fs.writeFileSync(pkgPath, JSON.stringify({
                    'name': 'matman-home',
                    'version': '0.0.0',
                    'private': true
                }, null, 4));
            }

            log.debug('.matman/package.json 文件已经创建');
            resolve(ctx);
        });
    }

    initLogs() {
        const ctx = this.ctx;
        const { logDir, log } = ctx;
        return new Promise(function (resolve) {
            fs.ensurePathSync(logDir);

            log.debug('.matman/logs 日志文件夹已经创建');
            resolve(ctx);
        });
    }
}

module.exports = function (ctx) {
    const client = new Client(ctx);

    return Promise.all([
        client.initHome(),
        client.initPkg(),
        client.initLogs()
    ]);
};
