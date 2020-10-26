<template>
  <div class="advantage-two">
    <div class="container">
      <h2>Jest 还是 Mocha ？TypeScript ？请随意</h2>

      <div class="row">
        <div class="col col--4">
          <p>使用 matman.js 做 web 端对端测试时，并不限制你使用 <code>Jest</code> 还是 <code>Mocha</code>，它提供了一整套方案帮助你获得数据，然后交给你用最熟悉的测试框架。</p>
          <p>项目中要用 <code>TypeScript</code>？没问题！使用 <a href="./tool/create-matman-app.html" target="_blank">create-matman-app</a> 快速创建你所需要的模板项目。</p>

          <div class="codeBlockWrapper_2QGZ">
            <pre class="prism-code language-sh codeBlock_19pQ" style="color:#bfc7d5;background-color:#292d3e"><div
                class="token-line" style="color:#bfc7d5"><span
                class="token plain"># 使用 Mocha</span></div><div
                class="token-line" style="color:#bfc7d5"><span
                class="token plain">$ npx create-matman-app [project_name]</span></div><div
                class="token-line" style="color:#bfc7d5"><span
                class="token plain"><br># 或者</span></div><div
                class="token-line" style="color:#bfc7d5"><span
                class="token plain">$ npx create-matman-app [project_name] --template=mocha</span></div></pre>
          </div>

          <div class="codeBlockWrapper_2QGZ">
            <pre class="prism-code language-sh codeBlock_19pQ" style="color:#bfc7d5;background-color:#292d3e"><div
                  class="token-line" style="color:#bfc7d5"><span
                  class="token plain"># 使用 Mocha + TS</span></div><div
                  class="token-line" style="color:#bfc7d5"><span
                  class="token plain">$ npx create-matman-app [project_name] --template=mocha-ts</span></div></pre>
          </div>

          <div class="codeBlockWrapper_2QGZ">
            <pre class="prism-code language-sh codeBlock_19pQ" style="color:#bfc7d5;background-color:#292d3e"><div
                  class="token-line" style="color:#bfc7d5"><span
                  class="token plain"># 使用 Jest</span></div><div
                  class="token-line" style="color:#bfc7d5"><span
                  class="token plain">$ npx create-matman-app [project_name] --template=jest</span></div></pre>
          </div>

          <div class="codeBlockWrapper_2QGZ">
            <pre class="prism-code language-sh codeBlock_19pQ" style="color:#bfc7d5;background-color:#292d3e"><div
                  class="token-line" style="color:#bfc7d5"><span
                  class="token plain"># 使用 Jest + TS</span></div><div
                  class="token-line" style="color:#bfc7d5"><span
                  class="token plain">$ npx create-matman-app [project_name] --template=jest-ts</span></div></pre>
          </div>
        </div>

        <div class="col col--4">
          <img class="feature-image" alt="Easy to get started in seconds"
               src="../../images/init.gif">
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.advantage-two {
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
    flex: 1 0;
    margin-left: 0;
    max-width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
    width: 100%;

    &.col--4{
      width: 50%;
    }
  }
}

</style>
