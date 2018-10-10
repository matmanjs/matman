const gConfig = require('../config');

class MatmanQueryItem {
  /**
   * 构造函数
   *
   * @param {Object | String} mockerName mocker 的名字，或者是对象
   * @param {String} [mockModuleName] mock module 的名字
   * @param {Boolean} [shouldDisableMatman] 是否禁用 mocker 服务
   */
  constructor(mockerName, mockModuleName, shouldDisableMatman) {
    if (mockerName && (typeof mockerName === 'object')) {
      // 如果传入的是对象，则假设这个对象是符合 MatmanQueryItem 字段定义的对象
      this._m_name = mockerName._m_name;
      this[gConfig.TARGET_FIELD] = mockerName[gConfig.TARGET_FIELD];
      this._m_disable = mockerName._m_disable;
    } else {
      // 如果传递的是普通的参数，则依次设置
      this._m_name = mockerName;
      this[gConfig.TARGET_FIELD] = mockModuleName;
      this._m_disable = shouldDisableMatman ? 1 : 0;
    }
  }

  /**
   * 是否为 disable 状态
   *
   * @returns {Boolean}
   */
  isDisabled() {
    return !!this._m_disable;
  }

  /**
   * 通过名字查询是否为当前的 MatmanQueryItem 项
   *
   * @param {String} name 数据模块名字
   * @returns {Boolean}
   */
  isMe(name) {
    return this._m_name === name;
  }
}

module.exports = MatmanQueryItem;