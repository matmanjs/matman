const fs = require('fs');
const istanbul = require('istanbul');
const glob = require('glob');

function getTreeSummary(collector) {
    const summarizer = new istanbul.TreeSummarizer();

    collector.files().forEach(function (key) {
        summarizer.addFileCoverageSummary(key, istanbul.utils.summarizeFileCoverage(collector.fileCoverageFor(key)));
    });

    return summarizer.getTreeSummary();
}

function getPathMap(treeSummary) {
    const ret = {};

    function walker(node) {
        ret[node.fullPath()] = node;
        node.children.forEach(function (child) {
            walker(child);
        });
    }

    walker(treeSummary.root);

    return ret;
}

/**
 * 合并不同的覆盖率文件，并生成新的结果
 *
 * @param {Object} obj 要追加的覆盖率信息
 * @param {Object} coverage 历史累积的覆盖率信息
 * @return {Object} 新累积的覆盖率信息
 */
function mergeClientCoverage(obj, coverage = {}) {
    if (!obj) {
        return;
    }

    Object.keys(obj).forEach(function (filePath) {
        const original = coverage[filePath];
        const existResult = obj[filePath];

        let result;

        if (original) {
            result = istanbul.utils.mergeFileCoverage(original, existResult);
        } else {
            result = existResult;
        }

        coverage[filePath] = result;
    });

    return coverage;
}

function getCoverageInfo(collector) {
    const treeSummary = getTreeSummary(collector);
    const pathMap = getPathMap(treeSummary);

    const filePath = treeSummary.root.fullPath();
    const outputNode = pathMap[filePath];

    return {
        lines: outputNode.metrics.lines.pct,
        statements: outputNode.metrics.statements.pct,
        functions: outputNode.metrics.functions.pct,
        branches: outputNode.metrics.branches.pct
    };
}

/**
 * 生成覆盖率结果
 *
 * @param {String} globPattern glob 这个组件使用到的文件匹配规则
 * @param {Object} [opts]
 * @param {String} [opts.dir] 覆盖率文件输出目录，默认值为 ./coverage
 */
function createE2ECoverage(globPattern, opts = {}) {
    return new Promise((resolve) => {
        const collector = new istanbul.Collector();
        let coverage;

        // options is optional
        glob(globPattern, {}, function (er, files) {
            // console.log(files);

            // 合并不同的覆盖率生产物
            files.forEach((file) => {
                const fileData = JSON.parse(fs.readFileSync(file));
                coverage = mergeClientCoverage(fileData, coverage);
            });

            // 追加
            collector.add(coverage);

            // 获取关键信息
            const coverageInfo = getCoverageInfo(collector);
            // console.log(coverageInfo);

            // 输出产物
            const sync = true;
            const reporter = new istanbul.Reporter();
            reporter.dir = opts.dir || './coverage';
            reporter.add('lcovonly');
            reporter.addAll(['clover', 'cobertura']);
            reporter.write(collector, sync, function () {
                // console.log('done');
                resolve({
                    data: coverageInfo,
                    reporterDir: reporter.dir
                });
            });
        });
    });
}

module.exports = {
    createE2ECoverage
};

