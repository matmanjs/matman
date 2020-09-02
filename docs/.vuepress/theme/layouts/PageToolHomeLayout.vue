<template>
  <div
      class="theme-container fastest-docs-container"
      :class="pageClasses"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
  >

    <Navbar />

    <div class="main-content">
      <h1>需要改造为九宫格</h1>
      <p>可参考 https://www.bootcss.com/</p>
      <ul>
        <li><a href="./devtools.html">Devtool</a></li>
        <li><a href="./proxy-switchyomega.html">Proxy SwitchyOmega</a></li>
        <li><a href="./whistle.html">Whistle</a></li>
      </ul>
    </div>

  </div>
</template>

<script>
import Home from '@theme/components/Home.vue';
import Navbar from '@theme/components/Navbar.vue';
import Page from '@theme/components/Page.vue';
import Sidebar from '@theme/components/Sidebar.vue';
import Footer from '../components/Footer';
import { resolveSidebarItems } from '../util/util';

export default {
  components: {
    Home,
    Page,
    Sidebar,
    Navbar,
    Footer,
  },

  data() {
    return {
      isSidebarOpen: false,
    };
  },

  computed: {
    shouldShowNavbar() {
      const { themeConfig } = this.$site;
      const { frontmatter } = this.$page;
      if (
          frontmatter.navbar === false
          || themeConfig.navbar === false) {
        return false;
      }
      return (
          this.$title
          || themeConfig.logo
          || themeConfig.repo
          || themeConfig.nav
          || this.$themeConfig.nav
      );
    },

    shouldShowSidebar() {
      const { frontmatter } = this.$page;
      return (
          !frontmatter.home
          && frontmatter.sidebar !== false
          && this.sidebarItems.length
      );
    },

    sidebarItems() {
      return resolveSidebarItems(
          this.$page,
          this.$page.regularPath,
          this.$site,
          this.$localePath,
      );
    },

    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass;
      return [
        {
          'no-navbar': !this.shouldShowNavbar,
          'sidebar-open': this.isSidebarOpen,
          'no-sidebar': !this.shouldShowSidebar,
        },
        userPageClass,
      ];
    },
  },

  mounted() {
    this.$router.afterEach(() => {
      this.isSidebarOpen = false;
    });
  },

  methods: {
    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen;
    },

    // side swipe
    onTouchStart(e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
    },

    onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x;
      const dy = e.changedTouches[0].clientY - this.touchStart.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true);
        } else {
          this.toggleSidebar(false);
        }
      }
    },
  },
};
</script>

<style lang="less">

.main-content {
  margin-top: 110px;
}

.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.theme-default-content, .content__default {
  position: relative;
  background-color: #fff;
  z-index: 999;
}

.fastest-docs-container .theme-default-content {
  max-width: inherit !important;

  a {
    color: #415b94
  }

  code {
    color: #c7254e;
    background-color: #f9f2f4;
  }
}

.fastest-docs-container .page-edit {
  max-width: inherit !important;
}

.fastest-docs-container .page-nav {
  max-width: inherit !important;

  a {
    color: #415b94
  }
}

.copyright__group {
  position: relative;
  z-index: 1;
}
</style>
