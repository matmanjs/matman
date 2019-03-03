const { useJquery } = require('web-crawl-util');

module.exports = () => {
    return {
        sectionInfo: getSectionInfo(),
        _version: Date.now()
    };
};

/**
 * 获取规则子模块的信息
 */
function getSectionInfo() {
    let result = {
        isExist: useJquery.isExist('#container .section1')
    };

    if (result.isExist) {
        result.title = useJquery.getText('#container .section1 .title');
        result.rulesLength = useJquery.getTotal('#container .section1 p');
        result.rules = _getRules('#container .section1');
    }

    return result;
}

function _getRules(jqCurContainer) {
    let rules = [];

    $('p', jqCurContainer).each(function () {
        rules.push(useJquery.getText(this));
    });

    return rules;
}