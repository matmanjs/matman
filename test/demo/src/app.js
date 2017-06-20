/**
 * 入口文件，配置项目
 */

const path = require('path');

const rootPath = path.dirname(__dirname);
const mockerPath = path.join(__dirname, 'mocker');

module.exports = {
  ENTRY_PATH: __dirname,
  ROOT_PATH: rootPath,
  MOCKER_PATH: mockerPath
};