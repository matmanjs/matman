<template>
    <div class="copyright">
        <div class="copyright__text">
            <div class="copyright__logo">
                <img :src="footerLogo">
            </div>
            <p>{{footer.copyright}}</p>
            <p>Documentation licensed under {{footer.lisence}}.</p>
        </div>
        <div class="copyright__group">
            <!-- <i class="copyright__wechat"></i> -->
            <a class="copyright__github" :href="footer.repoLink" target="_blank"></a>
        </div>
    </div>
</template>

<script>
    import footerLogo from '../images/logo_white_100.png';

    export default {
        computed: {
            footer() {
                return {
                    lisence: 'MIT',
                    copyright: `© ${new Date().getFullYear()} TENCENT IVWEB.All Rights Reserved`,
                    repoLink: 'https://github.com/matmanjs/matman'
                };
            },
            footerLogo() {
                return footerLogo;
            }
        }
    };
</script>

<style lang="less" scoped>
    @import "../styles/icon.less";

    .copyright {
        width: 100%;
        max-width: 1240px;
        padding: 0 20px;
        box-sizing: border-box;
        margin: 0 auto;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &__text {
            color: #bbbbbb;

            p:nth-child(2) {
                margin: 20px 0px 10px;
            }

            p:last-child {
                margin: 0px;
            }
        }

        &__logo {
            height: 30px;

            img {
                height: 100%;
            }
        }

        &__group {
            display: flex;
        }

        &__wechat,
        &__github {
            display: block;
            width: 51px;
            height: 50px;
            margin-right: 37px;
            background-size: 100% 100%;

            &:hover {
                cursor: pointer;
            }
        }

        &__wechat {
            position: relative;
            background-image: url(@wechat);

            &:hover {
                &::before {
                    content: '';
                    position: absolute;
                    top: -10px;
                    left: 50%;
                    transform: translate(-50%, -100%);
                    width: 200px;
                    height: 342px;
                    background-image: url(../images/wechat-qrcode.jpg);
                    background-size: 100%;
                }
            }

        }

        &__github {
            background-image: url(@github);
        }
    }
</style>
