/**
 * 在 url 中携带的 query 值，例如 /path/to/url?_matman=xxx
 *
 * @type {String}
 */
const MATMAN_QUERY_KEY = '_matman';

/**
 * mock_modules 的名字
 *
 * @type {String}
 */
const MOCK_MODULES = 'mock_modules';

/**
 * mock数据时，如果请求中携带了该属性，则优先返回该属性对应的数据模块值，此时将忽略 activeModule 的数据模块
 *
 * @type {String}
 */
const TARGET_FIELD = '_m_target';

module.exports = {
  MATMAN_QUERY_KEY,
  MOCK_MODULES,
  TARGET_FIELD
};