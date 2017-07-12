const path = require('path');

const matman = require('../../lib');

let options = {};

/**
 * 项目运行的根目录，是执行 run 方法的路径
 */
options.ROOT_PATH = path.dirname(__dirname);

/**
 * mocker 的根目录
 */
options.MOCKER_PATH = path.join(__dirname, 'mocker');

/**
 * log文件的本地路径，必须是绝对路径，如果不填写，则默认为 options.ROOT_PATH/logs
 */
options.LOG_PATH = path.join(options.ROOT_PATH, 'logs');

/**
 * 管理系统启动的服务端口，如果不填写，则默认为 3000
 */
options.port = 3000;

matman.run(options);