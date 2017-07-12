const path = require('path');

const matman = require('../lib/index');

let options = {};

/**
 * 项目运行的根目录，必填参数
 */
options.ROOT_PATH = __dirname;

/**
 * src 源文件的目录，非必填，默认值为 ROOT_PATH/src
 */
options.SRC_PATH = path.join(options.ROOT_PATH, './src');

/**
 * 编译之后的文件目录，是最终运行的目录，非必填，默认值为 ROOT_PATH/src
 */
options.APP_PATH = path.join(options.ROOT_PATH, './app');

/**
 * mocker 相对源文件目录的相对路径，非必填，默认值为 './mocker'
 */
options.MOCKER_RELATIVE_PATH = './mocker';

/**
 * log文件的本地路径，必须是绝对路径，非必填，默认值为 ROOT_PATH/logs
 */
options.LOG_PATH = path.join(options.ROOT_PATH, 'logs');

/**
 * 管理系统启动的服务端口，非必填，默认值为 3000
 */
options.port = 3000;

matman.run(options);