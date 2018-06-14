const QUERY_KEY = '_matman';

class QueryItem {
  /**
   * 构造函数
   *
   * @param {Object | String} mockerName mocker 的名字，或者是对象
   * @param {String} [mockModuleName] mock module 的名字
   * @param {Boolean} [shouldDisableMatman] 是否禁用 mocker 服务
   */
  constructor(mockerName, mockModuleName, shouldDisableMatman) {
    if (mockerName && (typeof mockerName === 'object')) {
      // 如果传入的时对象
      this._m_name = mockerName._m_name;
      this._m_target = mockerName._m_target;
      this._m_disable = mockerName._m_disable;
    } else {
      // 依次设置
      this._m_name = mockerName;
      this._m_target = mockModuleName;
      this._m_disable = shouldDisableMatman ? 1 : 0;
    }
  }

  isDisabled() {
    return !!this._m_disable;
  }
}

class QueryHandler {
  /**
   * 构造函数
   */
  constructor() {
    this.list = [];
  }

  /**
   * 增加一个元素
   *
   * @param {Object | String} mockerName mocker 的名字
   * @param {String} mockModuleName mock module 的名字
   * @param {Boolean} shouldDisableMatman 是否禁用 mocker 服务
   */
  addOne(mockerName, mockModuleName, shouldDisableMatman) {
    // TODO 也许这里应该要加一个去重判断
    this.list.push(new QueryItem(mockerName, mockModuleName, shouldDisableMatman));
  }

  getQueryString() {
    return QUERY_KEY + '=' + JSON.stringify(this.list);
  };

}

module.exports = {
  QueryItem: QueryItem,
  QueryHandler: QueryHandler,
  QUERY_KEY: QUERY_KEY
};