import {EventEmitter} from 'events';
import {MatmanResult} from './matmanResult';
import {PageDriver} from './pageDriver';

/**
 * 执行器需要实现的方法
 * @function getResult 获取结果
 * @function getConfig 获取配置
 * @function getNewInstance 获取实例
 * @function gotoPage 跳转页面
 * @function runActions 运行 Actions
 * @function cleanEffect 清除副作用
 *
 * @author wangjq4214
 */
export interface BrowserRunner extends EventEmitter {
  name: string;

  setPageDriver(p: PageDriver): void;
  getResult(): Promise<MatmanResult>;
  getConfig(): void;
  getNewInstance(): void;
  gotoPage(): void;
  runActions(i?: number): Promise<any[]>;
  cleanEffect(): void;
}
