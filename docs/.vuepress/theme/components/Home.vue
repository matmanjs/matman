<template>
    <div class="theme-container">
        <div class="layout__banner">
            <div class="particles">
                <vue-particles
                    color="#eee"
                    :particleOpacity="0.8"
                    :particlesNumber="80"
                    shapeType="circle"
                    :particleSize="4"
                    linesColor="#ddd"
                    :linesWidth="1"
                    :lineLinked="true"
                    :lineOpacity="0.4"
                    :linesDistance="150"
                    :moveSpeed="3"
                    :hoverEffect="true"
                    hoverMode="grab"
                    :clickEffect="true"
                    clickMode="push">
                </vue-particles>
            </div>
            <Banner />
        </div>
        <div class="layout__description">
            <Feature />
        </div>
        <div class="layout__community">
            <Community />
        </div>
    </div>
</template>

<script>
    import Navbar from './Navbar';
    import Banner from './Banner';
    import Feature from './Feature';
    import Community from './Community';
    import Links from './Links';
    import Copyright from './Copyright';

    import Vue from 'vue';
    import VueParticles from 'vue-particles';

    Vue.use(VueParticles);

    export default {
        components: {
            Navbar,
            Banner,
            Feature,
            Community,
            Links,
            Copyright
        }
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

    .layout {
        &__banner {
            display: flex;
            overflow: hidden;
            align-items: center;
            justify-content: center;
            height: 900px;
            background-image: linear-gradient(180deg,
            @color-start 0%,
            @color-end 100%);

            .particles {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
        }

        &__description {
            position: relative;
            z-index: 10;
        }

        &__product {
            position: relative;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding-bottom: 54px;
            background-color: #f9f9f9;
            z-index: 1;
        }

        &__contributor {
            position: relative;
            z-index: 1;
        }

        &__community {
            position: relative;
            padding-top: 70px;
            padding-bottom: 65px;
            z-index: 1;
        }

        &__links {
            position: relative;
            padding-top: 30px;
            padding-bottom: 33px;
            background-color: #1d272f;
            z-index: 1;
        }

        &__footer {
            position: relative;
            height: 180px;
            background-color: #171f26;
            z-index: 1;
        }
    }
</style>
