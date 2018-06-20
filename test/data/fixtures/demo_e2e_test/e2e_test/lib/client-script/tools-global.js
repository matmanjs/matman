function getBasic() {
    let result = {
        isDev: window.__DEV__,
        isDefinedIsServer: window.IS_SERVER === false
    };

    return result;
}

function getReportConfig() {
    let result = {
        badjsId: window._report_ && window._report_.opts.badjsId || -1
    };

    return result;
}

function getInfo() {
    return {
        basic: getBasic(),
        config: getReportConfig()
    };
}

module.exports = {
    getInfo: getInfo
};