const tools = require('web-crawl-util').useJquery;

module.exports = () => {
    let wrapperDom = document.querySelector('#root');

    return {
        section1Info: getSectionInfo('.section-1', wrapperDom),
        section2Info: getSectionInfo('.section-2', wrapperDom),
        section3Info: getSectionInfo('.section-3', wrapperDom)
    };
};

/**
 * 获取规则子模块的信息
 */
function getSectionInfo(curSelector, jqContainer) {
    let jqCurContainer = $(curSelector, jqContainer);

    let result = {
        isExist: tools.isExist(jqCurContainer)
    };

    if (result.isExist) {
        result.title = tools.getText('h2', jqCurContainer);
        result.rulesLength = tools.getTotal('p', jqCurContainer);
        result.rules = _getRules(jqCurContainer);
    }

    return result;
}

function _getRules(jqCurContainer) {
    let rules = [];

    $('p', jqCurContainer).each(function () {
        rules.push($.trim($(this).text()));
    });

    return rules;
}