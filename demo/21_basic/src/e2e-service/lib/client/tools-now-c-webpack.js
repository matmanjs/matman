function getRunInNow() {
    let result = {
        isSetWebviewLoaded: window._webviewloaded,
        isDefinedWebviewLoadFail: (typeof window.__WEBVIEW_LOADFAIL === 'function')
    };

    return result;
}

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
        appNow: getRunInNow(),
        config: getReportConfig()
    };
}

module.exports = {
    getInfo: getInfo
};