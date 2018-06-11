const MatmanQueryItem = require('./MatmanQueryItem');

class MatmanQuery {
  /**
   * 构造函数
   */
  constructor() {
    this.list = [];
  }

  static queryKey = '_matman';

  /**
   * 增加一个元素
   *
   * @param {Object | String} mockerName mocker 的名字
   * @param {String} mockModuleName mock module 的名字
   * @param {Boolean} shouldDisableMatman 是否禁用 mocker 服务
   */
  addOne(mockerName, mockModuleName, shouldDisableMatman) {
    // TODO 也许这里应该要加一个去重判断
    this.list.push(new MatmanQueryItem(name, target, shouldDisableMatman));
  }

  getQueryString() {
    return MatmanQuery.queryKey + '=' + JSON.stringify(this.list);
  };

}

module.exports = MatmanQuery;