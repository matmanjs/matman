<template>
    <ul v-if="links.length" class="links">
        <li class="links__item links__title">{{ title }}</li>
        <li
            v-for="(link, index) in links"
            class="links__item"
            :key="index"
        >
            <a
                :href="link.href"
                target="_blank"
            >{{ link.name }}</a>
        </li>
    </ul>
</template>

<script>
    export default {
        computed: {
            title() {
                return '友情链接';
            },
            links() {
                return {
                    name: '腾讯开源',
                    href: 'https://opensource.tencent.com/'
                };
            }
        }
    };
</script>

<style lang="less" scoped>
    .links {
        width: 100%;
        max-width: 1240px;
        margin: 0 auto;
        display: flex;
        padding: 0 20px;
        box-sizing: border-box;

        li {
            list-style: none;
        }

        &__item {
            margin-left: 88px;
            font-size: 18px;
            letter-spacing: 0px;

            a {
                color: #ffffff;
                opacity: 0.5;

                &:hover {
                    opacity: 1;
                }
            }
        }

        &__title {
            margin-left: 0;
            color: #ffffff;
        }
    }
</style>
