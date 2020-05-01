const fs = require('fs');
const path = require('path');
const runCmd = require('./run-cmd');

/**
 * 运行 lerna bootstrap 来初始
 * @return {Promise}
 */
function runLernaBootstrap() {
    const t = Date.now();

    console.error('开始执行 lerna bootstrap ...');

    return runCmd.runByExec('lerna bootstrap', { cwd: path.join(__dirname, '../') })
        .then((data) => {
            console.log(`lerna bootstrap 执行执行完成！耗时${Date.now() - t}ms`);
            return data;
        })
        .catch((err) => {
            console.error('lerna bootstrap 失败', err);

            return Promise.reject(err);
        });
}

/**
 * 执行构建 packages
 *
 * @return {Promise<>}
 */
function runBuildForEachPackage() {
    const t = Date.now();

    console.error('开始执行构建 packages ...');

    const PACKAGES_ROOT = path.join(__dirname, '../packages');

    const promiseList = [];
    promiseList.push(runCmd.runByExec('npm run build', { cwd: path.join(PACKAGES_ROOT, 'matman') }));
    promiseList.push(runCmd.runByExec('npm run build', { cwd: path.join(PACKAGES_ROOT, 'matman-crawler') }));

    return Promise.all(promiseList)
        .then((data) => {
            console.log(`构建 packages 完成，耗时${Date.now() - t}ms`);
            return data;
        })
        .catch((err) => {
            console.error('构建 packages 时失败', err);
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

    demoArr.forEach((demoName) => {
        //获取当前文件的绝对路径
        const fileDir = path.join(PACKAGES_ROOT, demoName);

        if (!fs.statSync(fileDir).isDirectory()) {
            return;
        }

        promiseList.push(runCmd.runByExec('npm test', { cwd: fileDir }));
    });

    console.log(`待测试的 package 总数量为：${promiseList.length} 个！`);

    return Promise.all(promiseList)
        .then((data) => {
            console.log(`执行各 package 中测试用例完成，耗时${Date.now() - t}ms`);
            return data;
        })
        .catch((err) => {
            console.error('执行各 package 中测试用例时失败', err);
            return Promise.reject(err);
        });
}

/**
 * 执行各demo中构建爬虫脚本
 *
 * @return {Promise<>}
 */
function runBuildForEachDemoProject() {
    const t = Date.now();

    console.error('开始执行构建爬虫脚本...');

    // 自动获取所有参与测试demo的路径
    const HI_DEMO_ROOT = path.join(__dirname, '../packages/matman/test/data/hi-demo');
    const demoArr = fs.readdirSync(HI_DEMO_ROOT);
    const promiseList = [];

    demoArr.forEach((demoName) => {
        //获取当前文件的绝对路径
        const fileDir = path.join(HI_DEMO_ROOT, demoName);

        if (!fs.statSync(fileDir).isDirectory()) {
            return;
        }

        promiseList.push(runCmd.runByExec('npm run build', { cwd: fileDir }));
    });

    console.log(`待测试的 demo 总数量为：${promiseList.length} 个！`);

    return Promise.all(promiseList)
        .then((data) => {
            console.log(`爬虫脚本构建完成，耗时${Date.now() - t}ms`);
            return data;
        })
        .catch((err) => {
            console.error('爬虫脚本构建时失败', err);
            return Promise.reject(err);
        });
}

/**
 * 执行端对端测试用例
 *
 * @return {Promise<>}
 */
function runTestDirect() {
    const t = Date.now();

    console.error('开始执行端对端测试用例...');

    return runCmd.runByExec('npm run test:direct', { cwd: path.join(__dirname, '../') })
        .then((data) => {
            console.log(`端对端测试用例执行执行完成！耗时${Date.now() - t}ms`);
            return data;
        })
        .catch((err) => {
            console.error('执行端对端测试时失败', err);
            return Promise.reject(err);
        });
}

console.log(`============开始执行===========`);

const t = Date.now();

//==================================================================
// 注意，执行 lerna bootstrap 时会执行 npm install 命令（而不是 tnpm install）
// 因此在公司内网运行时需要配置好 npm 的 registry: npm config set registry http://r.tnpm.oa.com
// 详见 http://tnpm.oa.com/
//==================================================================
// 1. 安装依赖和处理 package 之间的依赖
runLernaBootstrap()
    .then((data) => {
        // 2. 为各个 package 执行构建，因为后续测试流程都直接引用的是同源代码构建产物
        return runBuildForEachPackage()
            .then((data) => {
                // 3. 为各个 package 执行单元测试
                return runTestForEachPackage().then(() => {
                    // 4. 构建爬虫脚本，否则执行的时候爬虫脚本若不存在则会报错
                    return runBuildForEachDemoProject()
                        .then((data) => {
                            // 5. 执行端对端自动化测试
                            return runTestDirect();
                        });
                });
            });
    })
    .then((data) => {
        console.log(`============执行结束，总耗时${Date.now() - t}ms===========`);
    })
    .catch(() => {
        console.log(`============执行过程遇到异常，总耗时${Date.now() - t}ms===========`);
    });
