/**
 * 获取搜索框相关的信息
 */
function getSearchInputInfo() {
  return {
    keyWorld: jQuery("#kw").val(),
    searchBtnText: jQuery("#su").val(),
  };
}

/**
 * 获取搜索结果相关的信息
 */
function getSearchResultInfo() {
  const jqContainer = jQuery("#content_left");
  const result = {
    isExist: !!jqContainer.length,
    list: [],
  };

  function getItemData(jqItem) {
    return {
      title: jQuery(".t", jqItem).text().trim(),
      describe: jQuery(".c-abstract", jqItem).text().trim(),
      tpl: jqItem.attr("tpl"),
    };
  }

  jQuery(".c-container", jqContainer).each(function () {
    result.list.push(getItemData(jQuery(this)));
  });

  return result;
}

module.exports = () => {
  return {
    title: document.title,
    cookie: document.cookie,
    searchInputInfo: getSearchInputInfo(),
    searchResultInfo: getSearchResultInfo(),
  };
};
