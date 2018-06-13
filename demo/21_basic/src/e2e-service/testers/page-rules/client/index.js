const entry = {
    'rule/get-page-info': '/Users/helinjiang/gitprojects/now-app-cmshow/e2ex-app/app/src-client-script/output/rule/get-page-info.js'
};

function getScriptPath(name) {
    return entry[name];
}

module.exports = {
    getScriptPath: getScriptPath
};
