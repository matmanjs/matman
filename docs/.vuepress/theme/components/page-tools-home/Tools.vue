<template>
  <div class="main-content__tools">
    <div class="describe">
      <p>工欲善其事必先利其器，合理的利用工具，可以帮助我们完成 web 端对端测试，并大大提升编写测试用例的效率。</p>
    </div>

    <div class="tools-container-wrapper">
      <div class="tools-container" v-for="(toolListItem, index) in toolList" :key="index">
        <h2>{{ toolListItem.title }}</h2>
        <ul class="tools-list-box">
          <li class="tools-list-item" v-for="(toolItem, index) in toolListItem.list" :key="index">
            <a :href="toolItem.href">
              <img :src="toolItem.img" class="tools-logo" />
              <div class="tools-desc-wrap">
                <h4>{{ toolItem.name }}</h4>
                <p>{{ toolItem.desc }}</p>
                <p class="tools-desc-text">{{ toolItem.moreDesc }}</p>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      toolList: [
        {
          title: '开发者工具',
          list: [{
            href: './matman-chrome-devtools-extensions.html',
            img: require('../../images/tools-logo/matman-devtools-extensions.png'),
            name: 'Matman Chrome Devtools',
            desc: 'Chrome 扩展，Matman 辅助工具',
            moreDesc: 'matman-devtools是一款自动化测试辅助工具。您可以使用该工具来帮助你生成部分自动化测试代码，以减少您的工作量！',
          }],
        },
        {
          title: 'Mock Server',
          list: [{
            href: './mockstar.html',
            img: require('../../images/tools-logo/matman-devtools-extensions.png'),
            name: 'MockStar',
            desc: '轻量级前端Mock工具',
            moreDesc: '不只是提供快速搭建本地 Mock Server 的能力，更是 Mock 数据管理专家，纯 JavaScript，轻松掌握无门槛',
          }, {
            href: './mockstar-chrome-devtools-extensions.html',
            img: require('../../images/tools-logo/mockstar-devtools-extensions.png'),
            name: 'MockStar Chrome Devtools',
            desc: 'Chrome 扩展，MockStar 辅助工具',
            moreDesc: 'mockstar-devtools是一款辅助使用mockstar做mock服务的浏览器插件，通过减少开发过程中的页面切换，提升开发效率。',
          }],
        },
        {
          title: '代理',
          list: [{
            href: './whistle.html',
            img: require('../../images/tools-logo/whistle.png'),
            name: 'Whistle',
            desc: '跨平台抓包调试代理工具',
            moreDesc: 'Whistle 基本上覆盖了所有抓包调试代理可以实现的功能',
          }, {
            href: './proxy-switchyomega.html',
            img: require('../../images/tools-logo/proxy-switchy-omega.png'),
            name: 'Chrome 插件： Proxy SwitchyOmega',
            desc: '轻松快捷地管理和切换多个代理设置',
            moreDesc: '实现多个代理环境轻松切换，操作简单的、方便处理代码问题',
          }],
        },
      ],
      transparent: true,
    };
  },
};
</script>

<style lang="less" scoped>

@import "../../styles/content.less";
@import "../../styles/variable.less";

.main-content__tools {
  margin: 0 auto;
  width: @viewAreaWidth;
}

.describe {
  padding-top: 20px;
}

.tools-list-box {
  margin: 0 auto;
  padding: 0;
  width: 1020px;
  display: flex;
  flex-wrap: wrap;
}

.tools-list-item {
  box-sizing: border-box;
  list-style: none;
  margin: 10px;
  padding: 20px 14px;
  width: 320px;
  min-height: 380px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 2.5px 2.5px 8px 1px rgba(0, 0, 0, .3);
  opacity: .7;
  text-align: center;
}

.tools-logo {
  width: 128px;
  height: 128px;
}

.tools-desc-wrap {
  padding: 0 14px;

  h4 {
    margin: 0;
  }

  p {
    color: #666;
    font-size: 14px;
  }

  .tools-desc-text {
    color: #000;
  }
}
</style>
