import { EventEmitter } from 'events';
import { IMatmanResult } from './matman-result';
import { IPageDriver } from './page-driver';

/**
 * 执行器需要实现的方法
 * @function getResult 获取结果
 * @function getConfig 获取配置
 * @function getNewInstance 获取实例
 * @function gotoPage 跳转页面
 * @function runActions 运行 Actions
 * @function cleanEffect 清除副作用
 */
export interface IBrowserRunner extends EventEmitter {
  name: string;

  setPageDriver(p: IPageDriver): void;
  getResult(): Promise<IMatmanResult>;
  getConfig(): void;
  getNewInstance(): void;
  gotoPage(): void;
  runActions(i?: number): Promise<any[]>;
  cleanEffect(): void;
}