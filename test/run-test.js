const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const runCmd = require('./run-cmd');
const {startWhistle} = require('./start-whistle');

/**
 * 初始化项目，安装各个包的依赖关系
 * @return {Promise}
 */
function runInit() {
  const t = Date.now();

  console.error('开始执行 npm run init ...');

  return runCmd
    .runByExec('npm run init', {cwd: path.join(__dirname, '../')})
    .then(data => {
      console.log(`npm run init 执行执行完成！耗时${Date.now() - t}ms`);
      return data;
    })
    .catch(err => {
      console.error('npm run init 失败', err);

      return Promise.reject(err);
    });
}

/**
 * 执行构建 packages
 *
 * @return {Promise<>}
 */
function runBuildForEachPackage() {
  console.error('开始执行 npm run build ...');

  return runCmd
    .runByExec('npm run build', {cwd: path.join(__dirname, '../')})
    .then(data => {
      console.log(`npm run build 执行执行完成！耗时${Date.now() - t}ms`);
      return data;
    })
    .catch(err => {
      console.error('npm run build 失败', err);

      return Promise.reject(err);
    });
}

/**
 * 执行各 package 中测试用例
 *
 * @return {Promise<>}
 */
function runTestForEachPackage() {
  const t = Date.now();

  console.error('开始执行各 package 中测试用例...');

  // 自动获取
  const PACKAGES_ROOT = path.join(__dirname, '../packages');
  const demoArr = fs.readdirSync(PACKAGES_ROOT);
  const promiseList = [];

  demoArr.forEach(demoName => {
    //获取当前文件的绝对路径
    const fileDir = path.join(PACKAGES_ROOT, demoName);

    if (!fs.statSync(fileDir).isDirectory()) {
      return;
    }

    promiseList.push(runCmd.runByExec('npm test', {cwd: fileDir}));
  });

  console.log(`待测试的 package 总数量为：${promiseList.length} 个！`);

  return Promise.all(promiseList)
    .then(data => {
      console.log(`执行各 package 中测试用例完成，耗时${Date.now() - t}ms`);
      return data;
    })
    .catch(err => {
      console.error('执行各 package 中测试用例时失败', err);
      return Promise.reject(err);
    });
}

/**
 * 执行设置 whistle
 *
 * @return {Promise<>}
 */
function runUseWhistle(mockstarPort) {
  const t = Date.now();

  console.error('开始设置 whistle...');

  return new Promise((resolve, reject) => {
    startWhistle()
      .then(port => {
        console.log(`whistle 已启动，端口为 ${port}！耗时${Date.now() - t}ms`);

        runCmd
          .runByExec('npm run use-whistle', {
            cwd: path.join(__dirname, '../demo/test_using_local_code'),
          })
          .then(data => {
            console.log(`whistle 设置完成！耗时${Date.now() - t}ms`);
            resolve(port);
          })
          .catch(err => {
            console.error('whistle 设置失败', err);
            reject(err);
          });
      })
      .catch(err => {
        console.error('whistle 启动失败', err);
        reject(err);
      });
  });
}

/**
 * 为 test_using_local_code 启动 mockstar
 *
 * @return {Promise<>}
 */
function runMockstarForDemo() {
  const matmanAppPath = path.join(__dirname, '../demo/test_using_local_code/mockstar-app');

  return runCmd
    .runByExec('npm i', {cwd: matmanAppPath})
    .then(() => {
      console.log(`mockstar-app npm i 完成`);
      return runCmd
        .runByExec('npm start', {cwd: matmanAppPath})
        .then(() => {
          console.log(`mockstar 已经启动，端口为 9527`);
          return 9527;
        })
        .catch(err => {
          console.error('mockstar 启动失败：', err);
          return Promise.reject(err);
        });
    })
    .catch(err => {
      console.error('mockstar-app npm i 失败：', err);
      return Promise.reject(err);
    });
}

/**
 * 执行端对端测试用例
 *
 * @return {Promise<>}
 */
function runTestE2EDirect(whistlePort) {
  const t = Date.now();

  console.error('开始执行端对端测试用例...');

  let cmd = 'npm run test:e2e:direct';

  if (whistlePort) {
    cmd = `cross-env PORT=${whistlePort} ${cmd}`;
  }

  return runCmd
    .runByExec(cmd, {cwd: path.join(__dirname, '../')})
    .then(data => {
      console.log(`端对端测试用例执行执行完成！耗时${Date.now() - t}ms`);
      return data;
    })
    .catch(err => {
      console.error('执行端对端测试时失败', err);
      return Promise.reject(err);
    });
}

//==================================================================
// 注意，执行 lerna bootstrap 时会执行 npm install 命令（而不是 tnpm install）
// 因此在公司内网运行时需要配置好 npm 的 registry: npm config set registry http://r.tnpm.oa.com
// 详见 http://tnpm.oa.com/

async function startTest() {
  if (process.env.NO_INIT === '1') {
    console.log('不需要初始化 init!');
  } else {
    await runInit();
  }

  await runBuildForEachPackage();
  await runTestForEachPackage();

  if (process.env.NO_TEST_LOCAL === '1') {
    console.log('不需要进行同源测试！');
    await runTestE2EDirect();
  } else {
    const mockstarPort = await runMockstarForDemo();
    const whistlePort = await runUseWhistle(mockstarPort);
    await runTestE2EDirect(whistlePort);
  }
}

console.log(`============开始执行===========`);
const t = Date.now();

startTest()
  .then(data => {
    console.log(`============执行结束，总耗时${Date.now() - t}ms===========`);
  })
  .catch(err => {
    console.log(`============执行过程遇到异常，总耗时${Date.now() - t}ms===========`);
  });
