<template>
  <div class="page-tools-home">
    <Navbar />

    <div class="main-content">
      <Tools />
    </div>
  </div>
</template>

<script>
import Navbar from './Navbar.vue';
import Tools from './page-tools-home/Tools';

export default {
  components: {
    Navbar,
    Tools,
  },
};
</script>

<style lang="less" scoped>

.main-content {
  margin-top: 110px;
  background-color: #fefefe;
}

</style>
