'use strict';

class Validate {

  /**
   * Validate project
   * @param name
   * @returns {boolean}
   */
  static validateProjectName(name) {
    return /^now-(activity|h5|pc|mobile|web|app|qq)-/.test(name);
  }

  /**
   * Validate string length
   * @param str
   * @param len
   * @returns {boolean}
   */
  static validateStrLength(str, len) {
    let strLen = 0;
    for (let i = 0; i < str.length; i ++) {
      if (/^[\u4e00-\u9fa5]+$/g.test(str[i])) {
        strLen += 2;
      } else {
        strLen += 1;
      }
    }
    return strLen >= len;
  }
}

module.exports = Validate;
