<template>
  <div class="advantage-one">
    <div class="container">
      <div class="row">
        <div class="col">
          <h2>No Python! 轻松掌握无门槛</h2>
          <p>无需学习 Python ，只需要你了解 <code>HTML</code>、<code>CSS</code>和 <code>JS</code> 的一些基础知识，对了，你可能还需要会运行 <code>npm install</code>，入门上手轻松掌握无门槛，更适合 web
            前端开发者使用,即可开始编写 web 自动化测试之旅。</p>
        </div>

        <div class="col">
          <img class="feature-image" alt="Easy to get started in seconds"
               src="../../images/no_python_easy_use.png">
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
    margin-left: 0;
    max-width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
    width: 100%;
  }
}

</style>
