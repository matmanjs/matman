import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import yeoman from 'yeoman-environment';
import {findMatmanConfig, MatmanConfig} from 'matman-core';
import {CrawlerParser, build} from 'matman-crawler';
import {DealWith, Argv} from './types';

// 获取所有模板
const generators = fs
  .readdirSync(path.resolve(__dirname, '../generators'))
  .filter(f => !(f.startsWith('.') || f.endsWith('js')))
  .map(f => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const description = require(path.resolve(__dirname, '../generators', f, 'meta.json'))
      .description;
    return {
      name: `${f.padEnd(15)} - ${chalk.gray(description)}`,
      value: f,
      short: f,
    };
  });

const runGenerator = async (type: string, {name = '', cwd = process.cwd(), args = {}}) => {
  // 新建文件夹
  fs.ensureDirSync(path.resolve(cwd, name));

  // 更换运行路径
  cwd = path.join(cwd, name);

  const Generator = (await import(path.resolve(__dirname, './generators', `${type}.js`))).default;

  // 创建 ENV
  const env = yeoman.createEnv([], {
    cwd,
  });

  const generator = new Generator({
    name,
    env,
    resolved: path.resolve(path.resolve(__dirname, '../generators', type, 'templates')),
    args,
  });

  return generator.run(() => {
    console.log(chalk.green('✨ 项目生成成功'));
  });
};

const dealWith: DealWith = {
  /**
   * 新建模板项目
   */
  init: async argv => {
    let dirname = argv._[1];
    let type = argv.type;

    // 处理新建模板的文件夹
    if (dirname === undefined) {
      const answer = await inquirer.prompt([
        {type: 'input', message: '🤖请输入新建模板的文件夹名称', name: 'name'},
      ]);

      dirname = answer.name;
    }

    // 处理是否强制覆盖文件
    if (fs.pathExistsSync(path.resolve(process.cwd(), dirname))) {
      const answers = await inquirer.prompt([
        {
          name: 'confirm',
          message: '❗️ 请确认是否覆盖此文件',
          type: 'confirm',
          default: false,
        },
      ]);

      // 删除文件
      if (answers.confirm) {
        fs.removeSync(path.resolve(process.cwd(), dirname));
      } else {
        console.warn(chalk.yellow(`❌ 请删除现有文件, 或重新指定文件夹名称`));
        process.exit(1);
      }
    }

    // 选择模板
    if (!type || generators.findIndex(ele => ele.value === type) === -1) {
      // 选择模板
      const answers = await inquirer.prompt([
        {
          name: 'type',
          message: '🤙 请选择你需要使用的模板',
          type: 'list',
          choices: generators,
        },
      ]);

      type = answers.type;
    }

    try {
      await runGenerator(type as string, {
        name: dirname,
      });
    } catch (e) {
      // 模板生成失败
      console.error(chalk.red(`❌ 模板生成失败`), e);
      process.exit(1);
    }
  },
  /**
   * 编译爬虫脚本
   */
  build: async () => {
    const matmanConfig = findMatmanConfig(process.cwd()) as MatmanConfig;
    const files = new CrawlerParser(matmanConfig).getEntry();

    for (const item of Object.keys(files)) {
      console.log(chalk.yellow('😏 开始编译', item));

      const res = await build(files[item], {matmanConfig: matmanConfig});
      fs.outputFileSync(`${matmanConfig.crawlerBuildPath}/${item}.js`, res);

      console.log(chalk.green('😘 编译成功', item));
    }
  },
};

/**
 * 根据命令选择需要执行的方法
 * @param argv
 * @author wangjq4214
 */
export const run = async (argv: Argv): Promise<void> => {
  const command = argv._[0] as 'build' | 'init';

  const method = dealWith[command];

  if (!method) {
    console.error(chalk.red('👋 输入的命令不支持'));
    process.exit(1);
  }

  try {
    await method(argv);
  } catch (e) {
    console.error(chalk.red(`👋 执行失败`), e);
    process.exit(1);
  }
};
