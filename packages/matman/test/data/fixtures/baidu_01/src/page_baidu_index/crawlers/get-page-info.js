module.exports = () => {
    return {
        title: document.title,
        width: window.innerWidth,
        height: window.innerHeight,
        userAgent: navigator.userAgent,
        _version: Date.now(),
        searchBtnTxt: document.querySelector('#su').value,
        navInfo: getNavInfo()
    };
};

/**
 * 获取导航模块的信息
 */
function getNavInfo() {
    const jqContainer = $('#u1');
    let result = {
        isExist: !!jqContainer.length
    };

    function getNavData(nameAttr) {
        const jqItem = $(`a[name=${nameAttr}]`, jqContainer);

        const data = {
            isExist: !!jqItem.length
        };

        if (data.isExist) {
            data.name = jqItem.text();
            data.href = jqItem.attr('href');
        }

        return data;
    }

    if (result.isExist) {
        result.setting = getNavData('tj_settingicon');
        result.moreProduct = getNavData('tj_briicon');
    }

    return result;
}
