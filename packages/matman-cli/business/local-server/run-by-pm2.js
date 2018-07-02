const path = require('path');
const fse = require('fs-extra');
const spawn = require('cross-spawn');

const matmanMock = require('matman-mock');

module.exports = (configOpts) => {
  // console.log('run-by-pm2', configOpts);

  // pm2 的方式下，则需要先生成 pm2.json 文件，然后再使用 pm2 启动
  const buildPath = matmanMock.util.getMockServerBuildPath(configOpts.rootPath, configOpts.buildPath);
  const pm2ConfigFilePath = path.join(buildPath, 'pm2.json');

  // 获取配置信息
  let pm2Config = getPm2Config(configOpts);

  // 本地构建一份配置到 buildPath 下
  fse.outputJson(pm2ConfigFilePath, pm2Config)
    .then(() => {
      console.log('Generate pm2.json success!', pm2ConfigFilePath);

      // 构建成功之后启动
      run(pm2ConfigFilePath);
    })
    .catch((err) => {
      throw err;
    });
};

/**
 * 启动 pm2
 * @param {String} pm2ConfigFilePath pm2.json 配置文件绝对路径
 */
function run(pm2ConfigFilePath) {
  const runPm2 = spawn('pm2', ['start', pm2ConfigFilePath]);

  // 打印输出
  let output = '';

  // 成功信息
  runPm2.stdout.on('data', (data) => {
    output += data;
  }).pipe(process.stdout);

  // 异常信息
  runPm2.stderr.on('data', (data) => {
    output += data;
  }).pipe(process.stderr);

  // 运行结束
  runPm2.on('close', (code) => {
    // console.log({ code: code, data: output });
  });
}

/**
 * 获得最终的 pm2.json 中内容
 *
 * TODO 这里的配置项应该可以通过 configOpts 传递下来
 *
 * @param configOpts
 * @returns {{apps: *[]}}
 */
function getPm2Config(configOpts) {
  const mockServerPath = matmanMock.util.getMockServerBasePath(configOpts.rootPath, configOpts.mockServerPath);
  const buildPath = matmanMock.util.getMockServerBuildPath(configOpts.rootPath, configOpts.buildPath);
  const matmanConfigPath = path.join(configOpts.rootPath, 'matman.config.js');

  // http://pm2.keymetrics.io/docs/usage/application-declaration/
  let result = {
    apps: [
      {
        name: 'matman_app',
        script: path.join(__dirname, './start-app.js'),
        watch: [mockServerPath],
        ignore_watch: ['node_modules', buildPath],
        args: [matmanConfigPath, configOpts.rootPath],
        env: {
          COMMON_VARIABLE: 'true'
        },
        env_production: {
          NODE_ENV: 'production'
        }
      }
    ]
  };

  return result;
}
