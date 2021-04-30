import yargs from 'yargs';
import semver from 'semver';
import chalk from 'chalk';
import { run } from './run';
import { IArgv } from './types';

/**
 * cli 入口
 *
 */
export const Main = async (): Promise<void> => {
  // 验证版本
  if (!semver.satisfies(process.version, '>= 10.0.0')) {
    console.error(chalk.red('😱 CLI 依赖 Node.js 10.0.0 以上版本'));
    process.exit(1);
  }

  // 解析参数
  const { argv } = yargs
    .command('init', '� 初始化项目', yargs => yargs.option('type', {
      alias: 't',
      describe: '生成项目的类型',
      type: 'string',
    }))
    .command('build', '� 编译爬虫脚本', yargs => yargs.option('dev', {
      alias: 'd',
      describe: '是否生成调试版本',
      type: 'boolean',
    }))
    .help();

  // 执行方法
  await run(argv as IArgv);

  process.exit(0);
};
