// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getCallerPath } = require('../../../../lib/util/caller');

// 假设这个是 case_module 文件
module.exports = referFile => getCallerPath(referFile);
