<template>
    <div class="main-content__tools">
        <ul class="tools-list-box">
            <li class="tools-list-item">
                <a href="./devtools.html">
                    <img src="../images/matman-devtools-logo.png" class="tools-logo"/>
                    <div class="tools-desc-wrap">
                        <h4>Matman Devtools</h4>
                        <p>一款chrome扩展，用来帮助您生成测试代码</p>
                        <p class="tools-desc-text">matman-devtools是一款自动化测试辅助工具。您可以使用该工具来帮助你生成部分自动化测试代码，以减少您的工作量！</p>
                    </div>
                </a>
            </li>
            <li class="tools-list-item">
                <a href="./proxy-switchyomega.html">
                    <img src="../images/Proxy-SwitchyOmega-logo.png" class="tools-logo"/>
                    <div class="tools-desc-wrap">
                        <h4>Proxy SwitchyOmega</h4>
                        <p>轻松快捷地管理和切换多个代理设置。</p>
                        <p class="tools-desc-text">实现多个代理环境轻松切换，操作简单的、方便处理代码问题。</p>
                        
                    </div>
                </a>
            </li>
            <li class="tools-list-item">
                <a href="./whistle.html">
                    <img src="../images/whistle-logo.png" class="tools-logo"/>
                    <div class="tools-desc-wrap">
                        <h4>Whistle</h4>
                        <p>是基于 Node 实现的跨平台抓包调试代理工具</p>
                        <p class="tools-desc-text">whistle基本上覆盖了所有抓包调试代理可以实现的功能，且所有操作都可以通过类似配置hosts的方式实现。</p>
                    </div>
                </a>
            </li>
            <li class="tools-list-item">
                <a href="./mockstar.html">
                    <img src="../images/mockstar-logo.png" class="tools-logo"/>
                    <div class="tools-desc-wrap">
                        <h4>Mockstar Devtools</h4>
                        <p>是一个使mockstar的使用变得简单的浏览器插件</p>
                        <p class="tools-desc-text">mockstar-devtools是一款辅助使用mockstar做mock服务的浏览器插件，通过减少开发过程中的页面切换，提升开发效率。</p>
                    </div>
                </a>
            </li>
            <div>{{$page.frontmatter.tools}}</div>
        </ul>
    </div>
</template>

<script>
    export default {
        mounted() {
            console.log(this.$page)
        }
    }
</script>

<style lang="less" scoped> 

@import "../styles/content.less";
@import "../styles/variable.less";

.main-content__tools {
    margin: 0 auto;
    margin-bottom: 20px;
    width: @viewAreaWidth;
}

.tools-list-box {
    margin: 0;
    padding: 0;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
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
