const matman = require("matman");
const { BrowserRunner } = require("matman-runner-nightmare");

module.exports = () => {
  return (
    matman
      // 得到 pageDriver
      .launchSync(new BrowserRunner(), {
        show: true,
        doNotCloseBrowser: true,
        useRecorder: false,
      })
      // 设置 UA
      .setDeviceConfig({
        UA:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua",
        width: 1250,
        height: 400,
      })
      // 设置截屏
      .setScreenshotConfig(true)
      .setPageUrl("https://www.baidu.com")
      .addAction("SCAN_PAGE", (nightmare) => {
        return nightmare.wait("#su");
      })
      .evaluate(() => {
        return {
          title: document.title,
          width: window.innerWidth,
          height: window.innerHeight,
          userAgent: navigator.userAgent,
          _version: Date.now(),
          searchBtnTxt: document.querySelector("#su").value,
        };
      })
  );
};

module
  .exports()
  .then(function (result) {
    console.log(JSON.stringify(result));
  })
  .catch(function (error) {
    console.error("failed:", error);
  });
