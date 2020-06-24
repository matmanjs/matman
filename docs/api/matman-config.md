---
sidebarDepth: 0
---

# matman.config.js 配置

| 字段名 |  类型 | 含义描述 |
| --- | --- | --- |
| `rootPath` |  `String` | 项目根目录，默认为 `matman.config.js` 的路径，即 `__dirname` |
| `testerPath` |  `String` | 测试对象的根目录，默认值为 `path.resolve(rootPath, './src/testers')` |
| `testPath` |  `String` | 即将废弃，含义同 `testerPath` |
| `crawlerBuildPath` |  `String` | 前端爬虫脚本构建之后的目录，默认值为 `path.resolve(rootPath, './build/logs')`  |
| `screenshotPath` |  `String` | 屏幕截图保存的路径，默认值为 `path.resolve(rootPath, './src/screenshot')` |
| `isDevBuild` |  `Boolean` | 是否为开发模式，默认值为 `false` |
