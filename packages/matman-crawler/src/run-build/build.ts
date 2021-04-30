import { rollup } from 'rollup';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginJson from '@rollup/plugin-json';
import pluginResolve from '@rollup/plugin-node-resolve';

/**
 * 进行爬虫脚本打包
 * 改用 rollup 并且打包放在执行时进行
 * 干掉需要手工 build
 *
 * @param {String} entryPath
 */
const build = async (entryPath: string): Promise<string> => {
  // 打包
  const bundle = await rollup({
    input: entryPath,
    plugins: [pluginCommonjs(), pluginJson(), pluginResolve()],
  });

  // 生成
  const { output } = await bundle.generate({
    name: 'getPageInfo',
    format: 'iife',
  });

  return output[0].code;
};

export default build;
