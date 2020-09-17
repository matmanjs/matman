<template>
    <div class="banner-inner">
        <div class="left">
            <h1>{{ title }}</h1>
            <h2>{{ description }}</h2>
            <ul class="entry">
                <li class="left-btn">
                    <router-link :to="introductionLink">
                        {{ introduction }}
                    </router-link>
                </li>
                <li class="right-btn" v-if="$themeConfig.rightBtn">
                    <a :href="toWorkbenchLink" target="_blank">
                        {{ getStarted }}
                    </a>
                </li>
            </ul>
            <ul class="github">
                <li v-if="starLink" class="star">
                    <div class="button star--button">
                        <i class="icon star--icon"></i>
                        <a :href="starLink" target="_blank">Star</a>
                    </div>
                    <!-- Todo -->
                    <!-- <div class="count star--count">503</div> -->
                </li>
                <li v-if="fockLink" class="fork">
                    <div class="button fork--button">
                        <i class="icon fork--icon"></i>
                        <a :href="fockLink" target="_blank">Fork</a>
                    </div>
                    <!-- Todo -->
                    <!-- <div class="count fork--count">69</div> -->
                </li>
                <li v-if="issuesLink" class="issue">
                    <div class="button issue--button">
                        <i class="icon issue--icon"></i>
                        <a :href="issuesLink" target="_blank">Issues</a>
                    </div>
                </li>
            </ul>
        </div>
        <div class="right">
            <img :src="logoBig">
        </div>
    </div>
</template>

<script>
    import logoBig from '../images/fastest-config.svg';

    export default {
        computed: {
            title() {
                return 'matman.js';
            },
            description() {
                return 'web 端对端测试解决方案';
            },
            introductionLink() {
                return '/docs';
            },
            introduction() {
                return '快速开始 →';
            },
            toWorkbenchLink() {
                return 'https://github.com/matmanjs/matman';
            },
            getStarted() {
                return '管理平台';
            },
            starLink() {
                return 'https://github.com/matmanjs/matman';
            },
            fockLink() {
                return 'https://github.com/matmanjs/matman';
            },
            issuesLink() {
                return 'https://github.com/matmanjs/matman/issues';
            },
            logoBig() {
                return logoBig;
            }
        }
    };
</script>

<style lang="less" scoped>
    @import "../styles/icon.less";
    @import '../styles/content.less';

    h1,
    h2 {
        line-height: 1;
        color: #ffffff;
        padding: 0 20px;
    }

    h1 {
        font-size: 60px;
        margin-top: 0;
    }

    h2 {
        margin-top: 29px;
        font-size: 30px;
        font-weight: normal;
        border: none;
    }

    .banner-inner {
        position: absolute;
        width: 100%;
        max-width: 1200px;
        display: flex;
        flex-wrap: wrap-reverse;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    .entry {
        margin-top: 53px;
        display: flex;
        padding: 0 20px;

        li {
            box-sizing: border-box;
            margin-left: 24px;
            width: 220px;
            max-width: 220px;
            height: 60px;
            font-size: 22px;
            line-height: 60px;
            border-radius: 36px;
            border: solid 2px #ffffff;
            list-style: none;
            background-color: #fff;

            &.left-btn {
                margin-left: 0;
            }

            &.right-btn {
                background-color: transparent;

                a {
                    color: #fff;
                }
            }

            a {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                text-decoration: none;
                color: rgba(255, 101, 0, .5);
            }
        }
    }

    .github {
        margin-top: 55px;
        display: flex;
        font-size: 14px;
        letter-spacing: 0;
        color: #000000;
        padding: 0 20px;

        & > li {
            display: flex;
            height: 30px;

            &:not(:first-child) {
                margin-left: 18px;
            }
        }

        .button,
        .count {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            border-radius: 4px;
            border: solid 1px #e2e2e2;
            background-color: #ffffff;

            a {
                color: #000000;
            }
        }

        .button {
            width: 75px;
        }

        .icon {
            display: block;
            height: 16px;
            margin-right: 6px;
            background-size: 100% 100%;
        }

        .star--icon {
            width: 16px;
            background-image: url(@star);
        }

        .fork--icon {
            width: 12px;
            background-image: url(@fork);
        }

        .issue--icon {
            width: 16px;
            height: 16px;
            background-image: url('../images/issue.png');
        }

        .count {
            position: relative;
            width: 63px;
            margin-left: 7px;

            &::before {
                content: '';
                position: absolute;
                width: 7.0710px;
                height: 7.0710px;
                border-left: solid 1px #e2e2e2;
                border-bottom: solid 1px #e2e2e2;
                top: 50%;
                left: 0;
                transform: translate(-50%, -50%) rotate(45deg);
                background-color: #ffffff;
            }
        }
    }

    .left {
        width: 100%;
        min-width: 375px;
        max-width: 600px;
    }

    .right {
        width: 100%;
        min-width: 500px;
        max-width: 600px;
        text-align: center;

        img {
            margin-left: 20%;
            width: 65%;
        }
    }
</style>
