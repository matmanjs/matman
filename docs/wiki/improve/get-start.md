# 02. 项目起步

从本节开始，我们将从一个最基本的 `React` 应用出发，一步步实现对这个项目的单元测试与 E2E 测试。

## 1. React 项目

- 这个部分大家参照 [React 官网](https://reactjs.org/)进行项目的建立、编写即可
- React 项目不是我们的重点，在此我直接给出[示例项目]()

## 2. 新建测试结构

### 2.1 建立 DevOps 目录

- 在项目根目录下新建 `DevOps` 文件夹
- 这个目录是以后我们主要代码的编写目录，我们的流程控制、数据清理等都会在这里进行

### 2.2 新建 test 目录

- 在项目根目录下新建 `test` 文件夹
- 这个目录是之后的 mocha 测试文件的主要目录，我们的 UT 与 e2e 测试用例的主要代码在这里编写
- 添加配置文件 `/test/mocha.opts`，内容如下：

```text
--require babel-core/register
--recursive
--reporter spec
```

### 2.3 建立 dwt 项目

- 在 `DevOps` 目录下新建 `devops-app` 文件夹
- 执行下面命令，新建 Node.js 项目，并安装依赖

```bash
# 新建项目
$ npm -y init
# or
$ yarn -y init

# 安装依赖
$ npm install devops-web-test lodash
$ npm install -D cross-env
# or
$ yarn add devops-web-test lodash
$ yarn add -D cross-env
```

- 并将 package.json 中的 scripts 字段替换为：

```json
{
    "test": "cross-env DEBUG=nightmare node debug/test.js",
    "test:unit": "cross-env DWT_MODE=unit npm test",
    "test:e2e": "cross-env DWT_MODE=e2e npm test",
    "bootstrap": "cross-env MOCKSTAR_PORT=9527 WHISTLE_PORT=8899 node debug/bootstrap.js",
    "test-dev": "cross-env DEBUG=nightmare node debug/test-dev.js",
    "test-dev:unit": "cross-env DWT_MODE=unit npm run test-dev",
    "test-dev:e2e": "cross-env DWT_MODE=e2e npm run test-dev",
    "bootstrap-dev": "cross-env PROJECT_PORT=3000 MOCKSTAR_PORT=9527 WHISTLE_PORT=8899 node debug/bootstrap-dev.js"
}
```

### 2.4 建立 matman 项目

- 在 `DevOps` 目录下新建 `matman-app` 文件夹
- 执行下面命令，新建 Node.js 项目，并安装依赖

```bash
# 新建项目
$ npm -y init
# or
$ yarn -y init

# 安装依赖
$ npm install matman mockstar web-crawl-util
$ npm install -D matman-cli
# or
$ yarn add matman mockstar web-crawl-util
$ yarn add -D matman-cli
```

- 并将 package.json 中的 scripts 字段替换为：

```json
{
    "build": "matman build",
    "build-dev": "matman build --dev"
}
```

### 2.5 设置 whistle 规则

- 我们测试的是 React 编译之后的代码
- 所以需要将 URL 映射到文件，这里我们推荐使用[whistle](https://github.com/avwo/whistle)
- 在示例项目中我们给出了自动设置测试示例项目代理的脚本，当然你也可以手动设置，具体的实现请查看 `whistle` 官网

## 3. 编写流程控制代码

### 3.1 pipelines

在 devops-app 目录下新建 `pipelines.js` 文件，接下来我们来梳理运行自动化测试需要的步骤：

1. 清理缓存，以及上一次测试生成的文件夹
2. 初始化项目，正确配置环境等
3. 根据配置运行单元测试
4. 根据配置，构建项目、启动 mockstar、whistle 等
5. 安装与构建 matman
6. 运行端到端测试脚本
7. 文件归档及还原环境等

#### 3.1.1 清理缓存

在 pipelines.js 中加入下面的函数：

```js
async function handleBeforeRun() {
    await dwt.clean();
}
```

使用 DWT 内置的 API 清理文件。

#### 3.1.2 初始化项目

```js
async function handleInitProject(dwt) {
    const { testRecord } = dwt;

    // 项目 install
    testRecord.project.installCmd = 'npm install';
    await dwt.runByExec(testRecord.project.installCmd, { cwd: testRecord.project.rootPath });

    // 需要安装自动化测试需要的 reporter 等组件的依赖
    testRecord.project.extraPackagesInstallCmd = 'npm install cross-env nyc mocha-multi-reporters mochawesome mocha-junit-reporter --no-save';
    await dwt.runByExec(testRecord.project.extraPackagesInstallCmd, { cwd: testRecord.project.rootPath });
}
```

- 通过这一步我们将 React 项目需要的环境配置好，并且在此项目中注入了 `cross-env nyc mocha-multi-reporters mochawesome mocha-junit-reporter` 这几个库

- 完成了环境的初始化

#### 3.1.3 执行单元测试

```js
async function handleRunUnitTest(dwt) {
    const { testRecord } = dwt;

    // 为单元测试配置生成 reporter 配置
    const unitTestReporterConfigFile = await generateMochaReporterConfigFile(dwt, testRecord.unitTest.outputPath);

    // 执行单元测试
    testRecord.unitTest.testCmd = `npx cross-env BABEL_ENV=test mocha test/unit --reporter mocha-multi-reporters --reporter-options configFile=${unitTestReporterConfigFile}`;
    await dwt.runByExec(testRecord.unitTest.testCmd, { cwd: testRecord.unitTest.runTestPath });

    // 执行单元测试覆盖率
    testRecord.unitTest.coverageCmd = [
        `npx nyc --silent ${testRecord.unitTest.testCmd}`,
        `npx nyc report --reporter=html --report-dir=${testRecord.unitTest.coverageOutputPath}`,
        `npx nyc report --reporter=cobertura --report-dir=${testRecord.unitTest.coverageOutputPath}`,
        `npx nyc report --reporter=lcovonly --report-dir=${testRecord.unitTest.coverageOutputPath}`
    ].join(' && ');
    await dwt.runByExec(testRecord.unitTest.coverageCmd, { cwd: testRecord.project.rootPath });
}
```

在这一步的操作中我们一次进行了：

1. 为单元测试配置生成 reporter 配置
2. 执行单元测试
3. 执行单元测试覆盖率

#### 3.1.4 构建项目

```js
async function handleBuildProject(dwt, opts = {}) {
    const { testRecord } = dwt;

    if (opts.isDevelopment) {
        // 为项目获得一个没有被占用的端口
        const projectPort = await dwt.findAvailablePort('project');
        testRecord.project.port = projectPort;

        // 启动构建，由于是监听端口的，因此需要自定义结束
        testRecord.project.buildCmd = `npx cross-env ENABLE_E2E_TEST=1 PORT=${projectPort} npm start`;
        const projectBuildCmd = await dwt.runByExec(testRecord.project.buildCmd, { cwd: testRecord.project.rootPath }, (data) => {
            return data && data.indexOf('Compiled successfully') > -1;
        });

        testRecord.project.buildPid = projectBuildCmd.pid;

        // 为项目锁定这个已被占用的端口
        await dwt.lockPort('project', projectPort, testRecord.project.buildPid);

    } else {
        // 启动构建
        testRecord.project.buildCmd = 'npx cross-env ENABLE_E2E_TEST=1 npm run build';
        await dwt.runByExec(testRecord.project.buildCmd, { cwd: testRecord.project.rootPath });
    }
}
```

本函数比较复杂，根据当前是否为开发模式分为两种情况，在不同模式下面有不同的行为：

- 当为开发模式时，通过为项目获得未占用端口、锁定端口等操作获得构建之后的项目
- 当为非开发模式时，通过执行 `build` 命令，得到项目构建之后的产物

#### 3.1.5 启动 whistle

```js
async function handleStartWhistle(dwt, opts = {}) {
    const { testRecord } = dwt;

    if (opts.port) {
        // 如果传入了指定端口，则先杀掉这个端口
        await util.killPort(opts.port);

        // 停止 whistle
        await dwt.runByExec('w2 stop');

        // 直接使用指定的端口
        testRecord.whistle.port = opts.port;

        // 使用fastest自定义空间的命令字段参数，指定端口的场景下无需指定
        testRecord.whistle.useNamespaceArgs = '';
    } else {
        // 为 whistle 获得一个没有被占用的端口
        testRecord.whistle.port = await dwt.findAvailablePort('whistle');

        // 使用fastest自定义空间的命令字段参数
        testRecord.whistle.useNamespaceArgs = `-S ${testRecord.whistle.namespace}`;
    }

    // whistle 启动
    testRecord.whistle.startCmd = `w2 start ${testRecord.whistle.useNamespaceArgs} -p ${testRecord.whistle.port}`;
    const whistleStartCmd = await dwt.runByExec(testRecord.whistle.startCmd, {}, (data) => {
        return data && data.indexOf(`127.0.0.1:${testRecord.whistle.port}`) > -1;
    });

    testRecord.whistle.startPid = whistleStartCmd.pid;

    // 为 whistle 锁定这个已被占用的端口
    await dwt.lockPort('whistle', testRecord.whistle.port, testRecord.whistle.startPid);

    // 检查 whistle 是否实际ok
    await dwt.checkIfWhistleIsStarted(testRecord.whistle.port);

    // whistle 规则配置文件存储的路径
    const whistleRulesConfigFile = path.join(dwt.outputPath, 'test.whistle.js');
    testRecord.whistle.whistleRulesConfigFile = whistleRulesConfigFile;

    // 产生 whistle 规则配置文件
    await dwt.generateWhistleRulesConfigFile(whistleRulesConfigFile, opts.getWhistleRules);

    // 使用这个 whistle 规则文件
    testRecord.whistle.useCmd = `w2 use ${whistleRulesConfigFile} ${testRecord.whistle.useNamespaceArgs} --force`;
    await dwt.runByExec(testRecord.whistle.useCmd);
}
```

whistle 的配置不是我们的重点，大家自行查看上面的函数即可，总的来说就是根据传入的端口及配置规则运行 whistle 实例。

#### 3.1.6 安装和构建 matman

```js
async function handleStartMatman(dwt) {
    const { testRecord } = dwt;

    // matman-app 安装依赖
    testRecord.matman.installCmd = `npm install`;
    await dwt.runByExec(testRecord.matman.installCmd, { cwd: testRecord.matman.rootPath });

    // matman-app 构建
    testRecord.matman.buildCmd = `npm run build`;
    await dwt.runByExec(testRecord.matman.buildCmd, { cwd: testRecord.matman.rootPath });
}
```

这个步骤同样比较简单，只是到 matman 项目下安装依赖，并且构建项目。

#### 3.1.7 执行端到端测试

```js
async function handleRunE2ETestDirect(dwt) {
    const { testRecord } = dwt;

    // 为端对端测试配置生成 reporter 配置
    const e2eTestReporterConfigFile = await generateMochaReporterConfigFile(dwt, testRecord.e2eTest.outputPath);

    // 执行端对端测试
    testRecord.e2eTest.testCmd = `npx cross-env WHISTLE_PORT=${testRecord.whistle.port} mocha test/e2e --reporter mocha-multi-reporters --reporter-options configFile=${e2eTestReporterConfigFile}`;
    await dwt.runByExec(testRecord.e2eTest.testCmd, { cwd: testRecord.e2eTest.runTestPath });

    // 生成端对端测试覆盖率
    testRecord.e2eTest.generatedE2ECoverageDir = path.join(testRecord.matman.rootPath, 'build/coverage');
    await dwt.createE2ECoverage(path.join(testRecord.matman.rootPath, 'build/coverage_output/**/*.json'), testRecord.e2eTest.generatedE2ECoverageDir);
}
```

本函数大家可以对照单元测试的 [handle](./get_start#_3-编写流程控制代码) 来看。

#### 3.1.8 归档与结束

```js
async function handleArchive(dwt) {
    const { testRecord } = dwt;

    if (testRecord.e2eTest.enableTest) {
        // 将端对端测试的一些文件复制到测试归档目录中
        await dwt.copyMatmanBuildOutputToArchive({
            srcPath: path.join(testRecord.matman.rootPath, 'build'),
            distPath: path.join(dwt.outputPath, 'e2e_test_build_output'),
            generatedE2ECoverageDir: testRecord.e2eTest.generatedE2ECoverageDir,
            coverageOutputPath: testRecord.e2eTest.coverageOutputPath
        });
    }

    // 获得单元测试报告数据
    const unitTestReport = dwt.getTestReport('单元测试', {
        enableTest: testRecord.unitTest.enableTest,
        mochawesomeFilePath: path.join(testRecord.unitTest.outputPath, 'mochawesome.json'),
        coverageHtmlPath: path.join(testRecord.unitTest.coverageOutputPath, `index.html`)
    });
    testRecord.unitTest.report = unitTestReport;

    // 获得端对端测试报告数据
    const e2eTestReport = dwt.getTestReport('端对端测试', {
        enableTest: testRecord.e2eTest.enableTest,
        mochawesomeFilePath: path.join(testRecord.e2eTest.outputPath, 'mochawesome.json'),
        coverageHtmlPath: path.join(testRecord.e2eTest.coverageOutputPath, `index.html`)
    });
    testRecord.e2eTest.report = e2eTestReport;

    const indexData = {
        totalCost: `${dwt.getTotalCost() / 1000} 秒`,
        unitTest: {
            msg: testRecord.unitTest.report.testResult.summary
        },
        e2eTest: {
            msg: testRecord.e2eTest.report.testResult.summary
        },
        moreLinks: [{
            url: `output.zip`,
            msg: 'output.zip'
        }, {
            url: `test-record.json`,
            msg: 'test-record.json'
        }]
    };

    // 单元测试
    if (testRecord.unitTest.enableTest) {
        if (testRecord.unitTest.report.isTestSuccess) {
            indexData.unitTest.testOutputUrl = `${path.relative(dwt.outputPath, testRecord.unitTest.outputPath)}/mochawesome.html`;
        }

        if (testRecord.unitTest.report.isCoverageSuccess) {
            indexData.unitTest.coverageOutputUrl = `${path.relative(dwt.outputPath, testRecord.unitTest.coverageOutputPath)}/index.html`;
            indexData.unitTest.coverageMsg = testRecord.unitTest.report.coverageResult.htmlResult;
        }
    }

    // 端对端测试
    if (testRecord.e2eTest.enableTest) {
        if (testRecord.e2eTest.report.isTestSuccess) {
            indexData.e2eTest.testOutputUrl = `${path.relative(dwt.outputPath, testRecord.e2eTest.outputPath)}/mochawesome.html`;
        }

        if (testRecord.e2eTest.report.isCoverageSuccess) {
            indexData.e2eTest.coverageOutputUrl = `${path.relative(dwt.outputPath, testRecord.e2eTest.coverageOutputPath)}/index.html`;
            indexData.e2eTest.coverageMsg = testRecord.e2eTest.report.coverageResult.htmlResult;
        }

        indexData.moreLinks.push({
            url: path.basename(testRecord.whistle.whistleRulesConfigFile),
            msg: path.basename(testRecord.whistle.whistleRulesConfigFile)
        });
    }

    console.log(indexData);

    // 产生自定义报告
    await dwt.saveOutputIndexHtml(indexData, testRecord.archive.rootPath);

    // 存储一下测试过程的缓存数据
    await dwt.saveJsonFile(path.join(testRecord.archive.rootPath, 'test-record.json'), testRecord);

    // 压缩打包产物
    await dwt.compressDir(testRecord.archive.rootPath, path.join(testRecord.archive.rootPath, 'output.zip'));
}

async function handleAfterRun(dwt) {
    const { testRecord } = dwt;

    await dwt.clean({ doNotRemoveOutput: true });
}
```

这一步我们完成这样两件事：

- 将单元测试、端到端测试生成的产物进行归档，并根据其内容生成具体的测试报告、覆盖率报告等
- 将缓存文件清空

### 3.2 config

在 devops-app 目录下新建 `config.js` 文件，将我们所有步骤的 handle 串联起来。

#### 3.2.1 得到 DWT 实例

```js
function createDWT() {
    const dwt = new DevOpsWebTest(__dirname);

    // 项目工作区间
    const workspacePath = path.join(__dirname, '../../');

    // 是否单元测试和端对端测试
    const { shouldRunUnitTest, shouldRunE2ETest } = getActionConfigByDWTMode(process.env.DWT_MODE);

    dwt.testRecord = {
        shouldRunUnitTest,
        shouldRunE2ETest,
        project: {
            rootPath: workspacePath
        },
        mockstar: {
            rootPath: path.join(workspacePath, 'DevOps/mockstar-app')
        },
        matman: {
            rootPath: path.join(workspacePath, 'DevOps/matman-app')
        },
        unitTest: {
            enableTest: shouldRunUnitTest,
            runTestPath: workspacePath,
            outputPath: path.join(dwt.outputPath, 'unit_test_report'),
            coverageOutputPath: path.join(dwt.outputPath, 'unit_test_report/coverage')
        },
        e2eTest: {
            enableTest: shouldRunE2ETest,
            runTestPath: workspacePath,
            outputPath: path.join(dwt.outputPath, 'e2e_test_report'),
            coverageOutputPath: path.join(dwt.outputPath, 'e2e_test_report/coverage')
        },
        whistle: {
            namespace: `dwt_${dwt.seqId}`
        },
        archive: {
            rootPath: dwt.outputPath
        }
    };

    return dwt;
}
```

这里只是进行了 DWT 的配置，具体的配置项目大家可以查看文档。

#### 3.2.2 串联 handle

```js
/**
 * 执行自动化测试
 *
 * @return {Promise<DevOpsWebTest>}
 */
async function start() {
    const dwt = createDWT();

    try {
        // 开始
        await handleBeforeRun(dwt);

        // 初始化项目
        await handleInitProject(dwt);

        if (dwt.testRecord.shouldRunUnitTest) {
            // 执行单元测试
            await handleRunUnitTest(dwt);
        }

        if (dwt.testRecord.shouldRunE2ETest) {
            // 构建项目
            await handleBuildProject(dwt);

            // 启动 whistle
            await handleStartWhistle(dwt, {
                getWhistleRules: () => {
                    const whistleSetting = require(path.join(__dirname, '../whistle'));

                    return whistleSetting.getProdRules({
                        projectRootPath: dwt.testRecord.project.rootPath,
                        shouldUseMockstar: true,
                        mockstarPort: dwt.testRecord.mockstar.port,
                        name: dwt.testRecord.whistle.namespace
                    });
                }
            });

            // 安装和构建 matman
            await handleStartMatman(dwt);

            // 直接运行段对端测试命令
            await handleRunE2ETestDirect(dwt);
        }

        // 归档
        await handleArchive(dwt);

        // 结束
        await handleAfterRun(dwt);
    } catch (err) {
        console.error('run catch err', err);

        // 如果遇到异常情况，注意要清理被占用的资源，例如端口等
        await handleAfterRun(dwt);
    }

    return dwt;
}
```

- 在本函数中，我们将 pipeline 中所有的 handle 串联在一起，执行自动化测试
- 在给出的 demo 中我们在 debug 文件中进行了最后的结果的输出，你也可以选择直接执行这个函数