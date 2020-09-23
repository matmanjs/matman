<template>
  <div class="advantage-one">
    <div class="container">
      <div class="row">
        <div class="col col--4">
          <h2>快速开始，只需两步</h2>
          <p>只需一个命令即可初始化一个 Mock Server 项目，一个命令启动项目。已提供多种场景支持，拿来即用。</p>
          <p><br></p>
          <p>初始化一个新项目，例如 <i>my-app</i>, 可以运行如下命令:</p>
          <div class="codeBlockWrapper_2QGZ">
            <pre class="prism-code language-sh codeBlock_19pQ" style="color:#bfc7d5;background-color:#292d3e"><div
                class="token-line" style="color:#bfc7d5"><span
                class="token plain">npx create-mockstar-app my-app</span></div></pre>
          </div>

          <p>启动项目, 可以运行如下命令:</p>
          <div class="codeBlockWrapper_2QGZ">
            <pre class="prism-code language-sh codeBlock_19pQ" style="color:#bfc7d5;background-color:#292d3e"><div
                class="token-line" style="color:#bfc7d5"><span
                class="token plain">npx mockstar start --watch</span></div></pre>
          </div>
          <br>
        </div>

        <div class="col col--4">
          <img class="featureImage_3Xqx" alt="Easy to get started in seconds" src="../../images/init.gif">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.advantage-one {
  background-color: #f7f7f7;

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
