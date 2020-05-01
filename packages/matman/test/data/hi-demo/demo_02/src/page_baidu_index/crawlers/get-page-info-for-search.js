// 注意这里的 window.__coverage__ 只是为了模拟端对端测试覆盖率结果
// 实际场景时是需要借助其他工具来实现的
window.__coverage__ = {
    msg: 'i am coverage for e2e test'
};

module.exports = () => {
    return {
        title: document.title,
        cookie: document.cookie,
        searchInputInfo: getSearchInputInfo(),
        searchResultInfo: getSearchResultInfo()
    };
};

/**
 * 获取搜索框相关的信息
 */
function getSearchInputInfo() {
    return {
        keyWorld: jQuery('#kw').val(),
        searchBtnText: jQuery('#su').val()
    };
}

/**
 * 获取搜索结果相关的信息
 */
function getSearchResultInfo() {
    const jqContainer = jQuery('#content_left');
    const result = {
        isExist: !!jqContainer.length,
        list: []
    };

    function getItemData(jqItem) {
        return {
            title: jQuery('.t', jqItem).text().trim(),
            describe: jQuery('.c-abstract', jqItem).text().trim(),
            tpl: jqItem.attr('tpl')
        };
    }

    jQuery('.c-container', jqContainer).each(function () {
        result.list.push(getItemData(jQuery(this)));
    });

    return result;
}
