const urlParse = require('url-parse');

module.exports = class TesterConfig {
    constructor(opts = {}) {
        this.testerParentPath = opts.testerParentPath || '';
        this.testerName = opts.testerName || '';
        this.testerMain = opts.testerMain || '';
        this.testerUrl = opts.testerUrl || '';
        this.testerCmd = opts.testerCmd || '';
        this.testerGet = opts.testerGet || '';
    }

    updateByAnswer(opts = {}) {
        this.testerParentPath = opts.testerParentPath;
        this.testerName = opts.testerName;
        this.testerMain = opts.testerMain;
        this.testerUrl = opts.testerUrl;
    }
};

// console.log(urlParse('http://now.qq.com/index.html?a=111'))
// console.log(urlParse('/cgi-bin/index.html?a=111'))