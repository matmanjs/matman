const path = require('path');

const matman = require('../src/index');

const matmanMockerTest = require('matman-mocker-test');

let definedHandlers = [];

definedHandlers.push(matmanMockerTest);

let options = {};

options.definedHandlers = definedHandlers;

/**
 * 项目运行的根目录，必填参数
 */
options.ROOT_PATH = __dirname;

/**
 * src 源文件的目录，非必填，默认值为 ROOT_PATH/src
 */
options.SRC_PATH = path.join(options.ROOT_PATH, './src');

/**
 * 配置数据缓存路径，默认值为 ${ROOT_PATH}/data
 */
options.DATA_PATH = path.join(options.ROOT_PATH, './data');

/**
 * 编译之后的文件目录，是最终运行的目录，非必填，默认值为 ROOT_PATH/app
 */
options.APP_PATH = path.join(options.ROOT_PATH, './app');

/**
 * handler 相对源文件目录的相对路径，非必填，默认值为 './handler'
 */
options.HANDLERS_RELATIVE_PATH = './handler';

/**
 * log文件的本地路径，必须是绝对路径，非必填，默认值为 ROOT_PATH/logs
 */
options.LOG_PATH = path.join(options.ROOT_PATH, 'logs');

/**
 * 管理系统启动的服务端口，非必填，默认值为 3000
 */
options.port = 3000;

matman.run(options);