const urlHandle = require('url-handle');

/**
 * 获得背景图地址
 * @param {String || Element} jqCur css选择器或者jQuery对象
 * @param {Element} [jqContainer]
 * @return {String}
 */
function getBackgroundImageUrl(jqCur, jqContainer) {
    let curDom = $(jqCur, jqContainer)[0];

    if (!curDom) {
        return '';
    }

    // 这里不能够直接使用jQuery获取style的方式，因为有可能这个并没有写在其中

    // 获得 background-image 的设置，例如 'url("https://pic.url.cn/hy_personal_room/1210697536/12106975361512129362/640")';
    let backgroundImage = document.defaultView.getComputedStyle(curDom).backgroundImage;

    // 正则匹配找出实际的 url 地址，例如 https://pic.url.cn/hy_personal_room/1210697536/12106975361512129362/640
    let matchResult = backgroundImage.match(/url\("(.*)"\)/) || [];

    return matchResult[1] || '';
}

/**
 * 获得 img 标签中图片的地址
 * @param {String || Element} jqCur css选择器或者jQuery对象
 * @param {Element} [jqContainer]
 * @return {String}
 */
function getImageDomUrl(jqCur, jqContainer) {
    jqCur = $(jqCur, jqContainer);

    return jqCur.attr('src');
}

/**
 * 获得文字信息
 * @param {String || Element} jqCur css选择器或者jQuery对象
 * @param {Element} [jqContainer]
 * @return {String}
 */
function getText(jqCur, jqContainer) {
    jqCur = $(jqCur, jqContainer);

    return $.trim(jqCur.text());
}

/**
 * 获得dom上的属性
 * @param {String} name 属性名字
 * @param {String || Element} jqCur css选择器或者jQuery对象
 * @param {Element} [jqContainer]
 * @return {String}
 */
function getAttr(name, jqCur, jqContainer) {
    jqCur = $(jqCur, jqContainer);

    return $.trim(jqCur.attr(name));
}

/**
 * 获得有多少个符合条件的DOM
 * @param {String || Element} jqCur css选择器或者jQuery对象
 * @param {Element} [jqContainer]
 * @return {Number}
 */
function getTotal(jqCur, jqContainer) {
    jqCur = $(jqCur, jqContainer);

    return jqCur.length;
}

/**
 * 是否存在
 * @param {String || Element} jqCur css选择器或者jQuery对象
 * @param {Element} [jqContainer]
 * @return {Boolean}
 */
function isExist(jqCur, jqContainer) {
    return getTotal(jqCur, jqContainer) > 0;
}

/**
 * 获得 dom 元素中的部分计算属性值，只取一部分即可
 * @param {String || Element} jqCur css选择器或者jQuery对象
 * @param {Element} [jqContainer]
 * @return {Object}
 */
function getStyle(jqCur, jqContainer) {
    let curDom = $(jqCur, jqContainer)[0];

    if (!curDom) {
        return null;
    }

    let computedStyle = document.defaultView.getComputedStyle(curDom);

    return {
        width: computedStyle.width,
        height: computedStyle.height,
        lineHeight: computedStyle.lineHeight,
        // 判断是否是一行文字，注意此处即使是一行，height和lineHeight可能不是绝对相等，比如前者是 24.14px，而后者可能为 24.13px，但相差不大
        isOneLine: (parseInt(computedStyle.height) === parseInt(computedStyle.lineHeight))
    };
}

module.exports = {
    getBackgroundImageUrl: getBackgroundImageUrl,
    getImageDomUrl: getImageDomUrl,
    getStyle: getStyle,
    getAttr: getAttr,
    isExist: isExist,
    getText: getText,
    getTotal: getTotal,
    urlHandle: urlHandle
};