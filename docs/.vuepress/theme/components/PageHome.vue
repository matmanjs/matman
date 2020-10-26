<template>
  <div class="page-home">
    <Navbar/>

    <div class="main-wrapper">
      <Banner />
      <AdvantageOne />
      <AdvantageTwo />
      <AdvantageThree />
      <AdvantageFour />
      <Community />
    </div>

    <Footer/>
  </div>
</template>

<script>
import Navbar from './Navbar';
import Banner from './page-home/Banner';
import AdvantageOne from './page-home/AdvantageOne';
import AdvantageTwo from './page-home/AdvantageTwo';
import AdvantageThree from './page-home/AdvantageThree';
import AdvantageFour from './page-home/AdvantageFour';
import Community from './page-home/Community';
import Links from './Links';
import Copyright from './Copyright';
import Footer from './Footer';

import Vue from 'vue';
import VueParticles from 'vue-particles';

Vue.use(VueParticles);

export default {
  components: {
    Navbar,
    Banner,
    Community,
    Links,
    Copyright,
    Footer,
    AdvantageOne,
    AdvantageTwo,
    AdvantageThree,
    AdvantageFour
  },
};
</script>

<style lang="less" scoped>
@import '../styles/content.less';

body {
  background-color: #f9f9f9;
}

.theme-container {
  background-color: #f9f9f9;
}

.main-wrapper{
  flex: 1 0 auto;
  margin-top: 100px;
}
</style>
