// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export function evaluate() {
  // 如果没有这个变量，说明注入代码失败
  // if (!window.matman_ver) {
  //   return {
  //     error: 'preload failed!',
  //   };
  // }

  // window.getPageInfo 必须是个函数
  // window.getPageInfo 方法和其他变量均由 preload 配置中的 js 文件引入
  if (typeof getPageInfo !== 'function') {
    return {
      error: 'window.getPageInfo is not function!',
    };
  }

  // 如果存在需要前端执行的代码，则在所有逻辑开始之前执行
  if (window.evalList?.length) {
    window.evalList.forEach((item) => {
      // eslint-disable-next-line no-eval
      eval(window[item]);
    });
  }

  // 执行爬虫脚本
  const pageInfo = window.getPageInfo();

  // 计算覆盖率，这个值是固定值，由 istanbul-instrumenter-loader 这个注入的
  if (window.__coverage__ && pageInfo) {
    pageInfo.__coverage__ = window.__coverage__;
  }

  return pageInfo;
}
