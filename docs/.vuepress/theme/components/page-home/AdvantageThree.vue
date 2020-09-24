<template>
  <div class="advantage-three">
    <div class="container">
      <div class="row">
        <div class="col">
          <h2>又要学大堆新的 API？不，拥抱开源，我们只是站在巨人肩膀上</h2>
          <p>matman.js 并不要求你学习很多新的东西，只有寥寥数个 API，它提供了一套基于 <code>快照</code> 的测试思路；在底层，我们使用业界开源的技术框架，例如用 <code>puppeteer</code> 做浏览器驱动，用 <code>jQuery</code> 来写爬虫脚本，用 <code>Jest</code> 或者 <code>Mocha</code> 来做断言判断。</p>
        </div>

        <div class="col">
          <img class="feature-image" alt="Easy to get started in seconds"
               src="../../images/open_source_tools2.png">
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
