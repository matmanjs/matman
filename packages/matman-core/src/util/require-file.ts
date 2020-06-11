/**
 * 以同步的方式 require 文件
 * @param filePath
 */
export function requireSync(filePath: string): never {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return require(filePath);
}

/**
 * 以异步的方式 require 文件
 * @param filePath
 */
export async function requireAsync(filePath: string): Promise<never> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return import(filePath);
}
