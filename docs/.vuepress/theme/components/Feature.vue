<template>
    <div v-if="flow.length" class="flow">
        <div v-for="item in flow" class="flow-item">
            <i :style="{backgroundImage: `url('${item.backgroundImage}')`}" class="flow-item__icon"></i>
            <p class="flow-item__word">{{item.title}}</p>
            <p class="flow-item__desc">{{item.desc}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            flow() {
                return [{
                    title: '纯 JavaScript',
                    desc: '使用 JS 语言来写用例，无额外学习成本',
                    backgroundImage: 'http://res.imtt.qq.com/hippydoc/img/shazam.png'
                }, {
                    title: '简单易用 告别繁琐',
                    desc: '测试框架提供多种场景支持，拿来即用',
                    backgroundImage: 'https://qpic.url.cn/feeds_pic/ajNVdqHZLLDWz4s3BrgQo4hJVBIQjzX97yYVYRFF3jyoNJzNpyXQLA/'
                }, {
                    title: '不只是测试UI',
                    desc: '独有的数据快照模型，不仅可以测UI，还可以测接口请求、性能分析等',
                    backgroundImage: 'http://res.imtt.qq.com/hippydoc/img/home/icon-ft-4.png'
                }];
            }
        }
    };
</script>

<style lang="less" scoped>
    @import "../styles/icon.less";

    .flow {
        margin: 0 auto;
        width: 100%;
        max-width: 1200px;
        // height: 280px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-around;
        background-color: #fff;
        overflow: hidden;
        transform: translateY(-120px);
        box-shadow: 0px 10px 60px 0px rgba(0, 0, 0, 0.05);

        &-item {
            width: 240px;
            padding: 40px 0;
            overflow: hidden;

            &__icon {
                display: block;
                width: 110px;
                height: 110px;
                background-size: contain;
                background-position: center center;
                background-repeat: no-repeat;
                margin: 0 auto;
            }

            &__word {
                font-size: 24px;
                letter-spacing: 0px;
                color: #333;
                text-align: center;
            }

            &__desc {
                width: 100%;
                margin: 0 auto;
                font-size: 15px;
                text-align: center;
                color: #aaa;
            }
        }

        &-arrow {
            width: 17px;
            height: 106px;
            background-image: url(@flow-arrow);
            background-size: contain;
            background-repeat: no-repeat;
        }
    }
</style>
