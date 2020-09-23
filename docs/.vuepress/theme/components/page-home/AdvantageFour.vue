<template>
  <div class="advantage-three">
    <div class="container">
      <div class="row">
        <div class="col">
          <h2>复杂么？一大批配套工具已经来袭</h2>
          <p>无需准备额外的技能，使用 JS 语言来写 mock 数据，只需满足 CommonJS 规范，同步/异步皆支持，<code>pure object</code>、<code>function</code>、<code>json</code> 等形式任君选择。</p>
        </div>

        <div class="col">
          <img class="feature-image" alt="Easy to get started in seconds"
               src="../../images/module_use_js.png">
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
