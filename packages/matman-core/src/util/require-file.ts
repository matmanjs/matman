/**
 * 以同步的方式 require 文件
 * @param filePath
 */
export function requireSync(filePath: string): never {
  // 特殊业务逻辑处理必须要使用 require，因此此处才设置 ignore

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(filePath);
}

/**
 * 以异步的方式 require 文件
 * @param filePath
 */
export async function requireAsync(filePath: string): Promise<never> {
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  return import(filePath);
}
