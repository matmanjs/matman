---
sidebarDepth: 0
---

# matman.config.js 配置

## 1. 类型定义

```typescript
/**
 * 供 IDE 使用的启动项目的配置
 *
 * @member name 启动项目的名称
 * @member cwd 运行命令的文件夹
 * @member order 需要运行的命令
 * @member auto 是否在初始化时自动运行
 */
export interface SetupOptions {
  name: string;
  cwd?: string;
  order: string;
  auto?: boolean;
}

/**
 * matman 的配置类型
 * 同时为配置文件的结构, 当前对配置文件的解析只限制为 JS
 *
 * @member rootPath  matman 项目的根目录
 * @member caseModulesPath 测试案例的根目录
 * @member crawlerBuildPath 前端爬虫脚本构建之后的目录
 * @member crawlerInjectJQuery 前端爬虫脚本中是否注入jQuery
 * @member screenshotPath 屏幕截图保存的路径
 * @member coveragePath 覆盖率文件保存的路径
 * @member matmanResultPath MatmanResult 执行结果数据保存的路径
 * @member isDevBuild 是否为开发模式
 * @member setupOptions 提供 IDE 的启动命令
 */
export interface MatmanConfigOpts {
  rootPath?: string;
  caseModulesPath?: string;
  crawlerBuildPath?: string;
  crawlerInjectJQuery?: boolean;
  screenshotPath?: string;
  coveragePath?: string;
  matmanResultPath?: string;
  isDevBuild?: boolean;
  setupOptions?: SetupOptions[];
}
```

## 2. 含义介绍

| 字段名 |  类型 | 默认值 | 含义描述 |
| :-: | :-: | :-: | :-: |
| `rootPath` |  `String` | `__dirname` | 项目根目录 |
| `caseModulesPath` |  `String` | `path.resolve(rootPath, './src/case_modules')` | 测试对象的根目录 |
| `crawlerBuildPath` |  `String` | `path.resolve(rootPath, './build/crawler-script')` | 爬虫脚本构建之后的目录 |
| `crawlerInjectJQuery` | `Boolean` | `false` | 是否自动注入 JQuery |
| `screenshotPath` |  `String` | `path.resolve(rootPath, './build/screenshot_output')` | 屏幕截图保存的路径 |
| `coveragePath` | `String` | `path.resolve(rootPath, './build/coverage_output')` | 覆盖率文件保存路径 |
| `matmanResultPath` | `String` | `path.resolve(rootPath, './build/matman_result_output')` | matman 执行结果保存路径 |
| `isDevBuild` | `Boolean` | `false` | 是否为开发模式 |
| `setupOptions` | `Object` | `[]` | 供 IDE 使用的配置，目前阶段大家不需要关注 |

## 3. 文件示例

> - 目前仅支持 JS 配置文件
> - 在项目根目录下新建 `matman.config.js`

```js
module.exports = {
  rootPath: __dirname,
};
```

