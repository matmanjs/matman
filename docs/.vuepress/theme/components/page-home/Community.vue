<template>
  <div v-if="communities.length" class="community">
    <p class="index-title">{{ title }}</p>
    <div class="divide"></div>
    <ul class="community__list">
      <li class="community__item" v-for="(community, index) in communities" :key="index">
        <a :href="community.href" target="_blank">
          <img :src="community.logoPath" width="170" alt="community logo" />
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    title() {
      return '合作社区';
    },
    communities() {
      return [
        {
          logoPath: 'https://11.url.cn/now/app/community-pc/img/IVWEB_flow_869e7914.png',
          href: 'https://www.ivweb.io/',
        }, {
          logoPath:
              'https://qpic.url.cn/feeds_pic/PiajxSqBRaELREfBGmf12pwe1J0WOY5Fao1Cs8EDdMREia1eV1Micw49g/',
          href: 'https://feflowjs.com/',
        },
      ];
    },
  },
};
</script>

<style lang="less" scoped>
.community {
  width: 100%;
  max-width: 1250px;
  margin: 0 auto;

  .index-title {
    padding-bottom: 10px;
  }

  .divide {
    width: 50px;
    border-top: 3px solid #ff8b00;
    margin: 0 auto 40px;
  }

  &__list {
    margin-top: 35px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0;
  }

  &__item {
    width: 200px;
    height: 80px;
    // background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 4px 0px;
    // box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.04);

    &:first-child {
      margin-left: 0;
    }

    & > img {
      display: block;
      height: 50% px;
    }
  }
}
</style>
