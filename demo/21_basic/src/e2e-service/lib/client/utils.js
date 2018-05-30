const urlHandle = require('url-handle');

/**
 * 获得背景图地址
 * @param {String || Element} curDom css选择器或者是一个DOM元素
 * @param {Element} [containerDom]
 * @return {String}
 */
function getBackgroundImageUrl(curDom, containerDom) {
    if (typeof curDom === 'string') {
        curDom = _querySelector(curDom, containerDom);
    }

    if (!curDom) {
        return '';
    }

    // 获得 background-image 的设置，例如 'url("https://pic.url.cn/hy_personal_room/1210697536/12106975361512129362/640")';
    let backgroundImage = document.defaultView.getComputedStyle(curDom).backgroundImage;

    // 正则匹配找出实际的 url 地址，例如 https://pic.url.cn/hy_personal_room/1210697536/12106975361512129362/640
    let matchResult = backgroundImage.match(/url\("(.*)"\)/) || [];

    return matchResult[1] || '';
}

/**
 * 获得 img 标签中图片的地址
 * @param {String || Element} curDom css选择器或者是一个DOM元素
 * @param {Element} [containerDom]
 * @return {String}
 */
function getImageDomUrl(curDom, containerDom) {
    if (typeof curDom === 'string') {
        curDom = _querySelector(curDom, containerDom);
    }

    if (!curDom) {
        return '';
    }

    return curDom.getAttribute('src') || '';
}

/**
 * 获得文字信息
 * @param {String || Element} curDom css选择器或者是一个DOM元素
 * @param {Element} [containerDom]
 * @return {String}
 */
function getText(curDom, containerDom) {
    if (typeof curDom === 'string') {
        curDom = _querySelector(curDom, containerDom);
    }

    if (!curDom) {
        return '';
    }

    return curDom.innerHTML || '';
}

/**
 * 获得dom上的属性
 * @param {String} name 属性名字
 * @param {String || Element} curDom css选择器或者是一个DOM元素
 * @param {Element} [containerDom]
 * @return {String}
 */
function getAttr(name, curDom, containerDom) {
    if (typeof name !== 'string') {
        return '';
    }

    if (typeof curDom === 'string') {
        curDom = _querySelector(curDom, containerDom);
    }

    if (!curDom) {
        return '';
    }

    return curDom.getAttribute(name) || '';
}

/**
 * 获得有多少个符合条件的DOM
 * @param {String || Element} curDom css选择器或者是一个DOM元素
 * @param {Element} [containerDom]
 * @return {Number}
 */
function getTotal(curDom, containerDom) {
    if (typeof curDom === 'string') {
        curDom = _querySelectorAll(curDom, containerDom);
    }

    if (curDom && (typeof curDom.length === 'number')) {
        // 如果 curDom 为 querySelectorAll 返回的数组，则若不存在时为空数组，
        // 因此要校验数组中元素的个数必须大于0
        return curDom.length;
    } else {
        // 如果 curDom 为 querySelector 返回的对象，则若不存在时为null，
        // 因此校验它存在即可
        return curDom ? 1 : 0;
    }
}

/**
 * 是否存在
 * @param {String || Element} curDom css选择器或者是一个DOM元素
 * @param {Element} [containerDom]
 * @return {Boolean}
 */
function isExist(curDom, containerDom) {
    return getTotal(curDom, containerDom) > 0;
}

/**
 * 获得 dom 元素中的部分计算属性值，只取一部分即可
 * @param {String || Element} curDom css选择器或者是一个DOM元素
 * @param {Element} [containerDom]
 * @return {Object}
 */
function getStyle(curDom, containerDom) {
    if (typeof curDom === 'string') {
        curDom = _querySelector(curDom, containerDom);
    }

    if (!curDom) {
        return '';
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

function _querySelector(selector, containerDom) {
    if (containerDom) {
        return containerDom.querySelector(selector);
    } else {
        return document.querySelector(selector);
    }
}

function _querySelectorAll(selector, containerDom) {
    if (containerDom) {
        return containerDom.querySelectorAll(selector);
    } else {
        return document.querySelectorAll(selector);
    }
}

module.exports = {
    getBackgroundImageUrl: getBackgroundImageUrl,
    getImageDomUrl: getImageDomUrl,
    getStyle: getStyle,
    getAttr: getAttr,
    isExist: isExist,
    getText: getText,
    getTotal: getTotal,
    $: _querySelector,
    $$: _querySelectorAll,
    urlHandle: urlHandle
};