const {getCallerPath} = require('../../../../lib/util/caller');

module.exports = referFile => {
  // 假设这个是 case_module 文件
  return getCallerPath(referFile);
};
