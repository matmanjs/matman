/**
 * 入口文件，配置项目
 */

const path = require('path');

const rootPath = path.dirname(__dirname);
const mockerPath = path.join(__dirname, 'mocker');

// 配置的文件地址请传入绝对地址，或者相对于 mockerPath 的相对地址。
const route = {
  '/cgi-bin/a/b/simple_cgi': path.join(__dirname, './mocker/simple_cgi'),
  '/cgi-bin/a/b/standard_cgi': './standard_cgi',
};

module.exports = {
  ENTRY_PATH: __dirname,
  ROOT_PATH: rootPath,
  MOCKER_PATH: mockerPath,
  route: route
};