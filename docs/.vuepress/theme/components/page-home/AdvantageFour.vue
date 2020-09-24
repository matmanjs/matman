<template>
  <div class="advantage-three">
    <div class="container">
      <div class="row">
        <div class="col">
          <h2>使用复杂么？一大批配套工具已经来袭</h2>
          <p>我们深知 web 自动化测试不是一件容易的事情，因此已经开发（或开发中）一套配套工具，降低编写用例成本，提升开发体验。</p>
        </div>

        <div class="col">
          <div class="box-container">
            <div class="box">
              <a href="./tool/create-matman-app.html" target="_blank">
                <img class="feature-image" src="../../images/tools-logo/create-matman-app.jpg" />
                <p>create-matman-app</p>
              </a>
            </div>

            <div class="box">
              <a href="./tool/matman-chrome-devtools-extensions.html" target="_blank">
                <img class="feature-image" src="../../images/tools-logo/matman-chrome-devtools-extensions.jpg" />
                <p>matman Developer Tools</p>
              </a>
            </div>

            <div class="box">
              <a href="./tool/matman-vscode-plugin.html" target="_blank">
                <img class="feature-image" src="../../images/tools-logo/matman-vscode-plugin.jpg" />
                <p>matman VSCode 插件</p>
              </a>
            </div>

            <div class="box">
              <a href="./tool/mockstar.html" target="_blank">
                <img class="feature-image" src="../../images/tools-logo/mockstar.png" />
                <p>MockStar mock 工具</p>
              </a>
            </div>

            <div class="box">
              <a href="./tool/mockstar-chrome-devtools-extensions.html" target="_blank">
                <img class="feature-image" src="../../images/tools-logo/mockstar-chrome-devtools-extensions.jpg" />
                <p>MockStar Developer Tools</p>
              </a>
            </div>

            <div class="box">
              <a href="./tool/" target="_blank">
                <img class="feature-image" src="../../images/tools-logo/matman-coming-soon.jpg" />
                <p>更多...</p>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.advantage-three {
  background-color: #fff;

  .container {
    text-align: left;
    padding-bottom: 5rem !important;
    padding-top: 5rem !important;
  }
}

.row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: -1rem;
  margin-right: -1rem;

  .col {
    display: block;
    margin-left: 0;
    max-width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
    width: 100%;


  }
}

.box-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: -1rem;
  margin-right: -1rem;

  .box {
    display: block;
    margin-left: 0;
    max-width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
    width: 13%;

    p {
      margin: 0;
      text-align: center;
      font-size: 10px;
    }
  }
}

</style>
