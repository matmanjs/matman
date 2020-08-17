<template>
    <header :style="styles.navbar">
        <nav>
            <router-link :to="localePath">
                <img :src="styles.logo" :style="styles.logoStyle" alt="logo" />
            </router-link>
            <ul class="navs">
                <li class="nav" v-for="(nav, index) in navs" :key="index">
                    <router-link
                        :class="getNavClass(nav.link, styles.navClass)"
                        v-if="!isExternal(nav.link)"
                        :to="nav.link"
                        :style="styles.word"
                    >{{ nav.text }}
                    </router-link>
                    <a
                        v-else
                        :href="nav.link"
                        :class="getNavClass(nav.link, styles.navClass)"
                        target="_blank"
                        rel="noopener noreferrer"
                        :style="styles.word"
                    >{{ nav.text }}</a>
                    <OutboundLink v-if="isExternal(nav.link)" />
                </li>
            </ul>
        </nav>
    </header>
</template>

<script>
    import { isExternal } from '../util/util.js';
    import logo from '../images/logo_white_100.png';
    import logoGreen from '../images/logo_100.png';

    export default {

        data() {
            return {
                alpha: 0,
                transparent: true
            };
        },

        computed: {
            localePath() {
                return this.$localePath;
            },
            navs() {
                const config = this.$themeLocaleConfig || {};
                return config.navs || [];
            },
            styles() {
                const alpha = this.$page.frontmatter.home ? this.alpha : 1;
                let styles = {
                    navbar: {
                        backgroundColor: `rgba(255, 255, 255, ${alpha})`
                    },
                    word: {
                        color: 'rgba(255, 255, 255, 0.8)'
                    },
                    navClass: 'nav__link',
                    langClass: 'nav__link',
                    logo,
                    logoStyle: {
                        // width: '220px',
                        height: '50px'
                    }
                };

                if (alpha >= 1) {
                    styles.navbar.boxShadow = '0px 2px 30px 0px rgba(0, 0, 0, 0.1)';
                }
                if (alpha > 0.3) {
                    styles.logo = logoGreen;
                    styles.word.color = `rgba(102, 102, 102, ${alpha})`;
                    styles.navClass = 'nav__link--white';
                    styles.langClass = 'nav__lang--white';
                }

                return styles;
            }
        },

        mounted() {
            window.addEventListener('scroll', this.onScroll);
            this.alpha = 0;
            this.transparent = location.pathname === '/';
        },

        methods: {
            getNavClass(link, className) {
                const currentPath = this.$route.path;
                return currentPath === link && className === 'nav__link--white'
                    ? 'nav__link--active'
                    : className;
            },
            onScroll() {
                const scrollTop = window.scrollY;
                this.alpha = scrollTop / 100;
            },
            calTransparent() {
                this.transparent = location.pathname === '/';
            },
            isExternal
        }
    };
</script>

<style lang="less" scoped>
    @import "../styles/content.less";
    @import "../styles/variable.less";

    header {
        position: fixed;
        top: 0;
        width: 100%;
        height: 100px;
        z-index: 1000;
    }

    nav {
        position: relative;
        display: flex;
        width: @viewAreaWidth;
        height: 100%;
        margin: 0 auto;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;

        li {
            list-style: none;
        }
    }

    .navs,
    .tools {
        display: flex;
    }

    .nav {
        position: relative;
        height: 100%;
        align-items: center;
        display: flex;

        &:not(:first-child) {
            margin-left: 40px;
        }

        &__link,
        &__link--white,
        &__lang--white,
        &__link--active {
            font-size: 18px;
            letter-spacing: 0px;
            text-decoration: none;
        }

        &__link:hover {
            color: #fff !important;
        }

        &__link--active,
        &__link--white:hover {
            color: @color-link !important;

            &::before {
                content: "";
                position: absolute;
                bottom: -38px;
                width: 100%;
                height: 4px;
                background-color: @color-link;
            }
        }

        &__lang--white:hover {
            color: @color-link !important;
        }
    }
</style>
