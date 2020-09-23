<template>
  <div class="advantage-two">
    <div class="container">
      <div class="row">
        <div class="col">
          <h2>不只是 Mock Server，更是 Mock 数据管理专家</h2>
          <p>提供配套的 UI 后台，可视化管理你的所有 Mock 数据，并可任意指定返回所需要的 Mock 数据上。</p>
        </div>

        <div class="col">
          <img class="feature-image" alt="Easy to get started in seconds"
               src="../../images/admin_ui_dashboard.png">
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
    margin-left: 0;
    max-width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
    width: 100%;
  }
}

</style>
