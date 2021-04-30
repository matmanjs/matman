interface IWhistleRuleConfig {
  name: string;
  rules: string;
}

interface IWhistleUtil {
  // 当前 whistle 启动的端口
  port: number;

  // 判断指定的 whistle 插件是否存在，接受一个 name 参数，返回一个 Boolean 值
  existsPlugin: (name: string) => boolean;
}

export default class WhistleRule {
  public name: string;
  public ruleArr: string[];

  constructor(name: string, rules: string | string[]) {
    // whistle 规则的名字
    this.name = name;

    // whistle 规则的配置列表
    this.ruleArr = Array.isArray(rules) ? rules : [rules];
  }

  /**
   * 获得 whistle 中用到的且符合它的格式的数据
   * http://wproxy.org/whistle/cli.html
   *
   * @returns {IWhistleRuleConfig}
   */
  public getConfig(): IWhistleRuleConfig {
    return  {
      name: this.name,
      rules: this.ruleArr.join('\n'),
    };
  }

  /**
   * 转为 w2 动态设置规则的方法
   *
   * @returns {Function}
   */
  convertForW2() {
    /**
     * 动态生成 whistle 规则，用于给 w2 命令使用
     *
     * @param {Function} cb 回调函数，接受两个参数 name(规则集名字) 和 rules(具体规则)
     * @param {Object} [util] 工具集
     * @param {Number} [util.port] 当前 whistle 启动的端口
     * @param {Function} [util.existsPlugin] 判断指定的 whistle 插件是否存在，接受一个 name 参数，返回一个 Boolean 值
     */
    return (cb: (r: IWhistleRuleConfig) => void, util: IWhistleUtil) => {
      console.log(`即将动态设置 whistle 规则（ http://127.0.0.1:${util.port}）...`);

      const result = this.getConfig();

      console.log('whistle 规则信息为：\n', JSON.stringify(result, null, 2));

      cb(result);

      console.log('动态设置 whistle 规则已完成！');
    };
  }
}
