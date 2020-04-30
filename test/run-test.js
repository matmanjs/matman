// 测试之前需要将各个组件进行构建
// 测试之前需要进行构建，因为没有用 babel 处理
// 测试结束之后需要移除所有的 build 文件夹？

const fs = require('fs');
const path = require('path');
const runCmd = require('./run-cmd');

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

console.log(`开始执行，数量为：${promiseList.length} 个！`);

const startT = Date.now();
Promise.all(promiseList)
    .then((data) => {
        const buildCompleteT = Date.now();
        console.log(`构建完成，耗时${buildCompleteT - startT}ms，开始执行测试用例...`);

        runCmd.runByExec('npm run  test:direct', { cwd: path.join(__dirname, '../') })
            .then((data) => {
                console.log(`测试用例执行执行完成！耗时${Date.now() - buildCompleteT}ms`);
            })
            .catch((err) => {
                console.error('执行测试时失败', err);
            });
    })
    .catch((err) => {
        console.error('构建项目时失败', err);
    });