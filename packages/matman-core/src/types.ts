/**
 * 供 IDE 使用的启动项目的配置
 *
 * @member name 启动项目的名称
 * @member cwd 运行命令的文件夹
 * @member order 需要运行的命令
 * @member auto 是否在初始化时自动运行
 */
export interface ISetupOptions {
  name: string;
  cwd?: string;
  order: string;
  auto?: boolean;
}
