(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{502:function(t,e,n){},505:function(t,e,n){"use strict";n.d(e,"a",(function(){return l})),n.d(e,"b",(function(){return f}));n(36),n(161),n(279),n(163),n(278),n(105),n(70),n(504),n(106),n(506),n(162);var a=/#.*$/,i=/\.(md|html)$/,s=/\/$/,r=/^(https?:|mailto:|tel:|[a-zA-Z]{4,}:)/;function o(t){return decodeURI(t).replace(a,"").replace(i,"")}function l(t){return r.test(t)}function c(t){if(l(t))return t;var e=t.match(a),n=e?e[0]:"",i=o(t);return s.test(i)?t:i+".html"+n}function u(t,e,n){if(l(e))return{type:"external",path:e};n&&(e=function(t,e,n){var a=t.charAt(0);if("/"===a)return t;if("?"===a||"#"===a)return e+t;var i=e.split("/");n&&i[i.length-1]||i.pop();for(var s=t.replace(/^\//,"").split("/"),r=0;r<s.length;r++){var o=s[r];".."===o?i.pop():"."!==o&&i.push(o)}""!==i[0]&&i.unshift("");return i.join("/")}(e,n));for(var a=o(e),i=0;i<t.length;i++)if(o(t[i].regularPath)===a)return Object.assign({},t[i],{type:"page",path:c(t[i].path)});return console.error('[vuepress] No matching page found for sidebar item "'.concat(e,'"')),{}}function f(t,e,n,a){var i=n.pages,s=n.themeConfig,r=a&&s.locales&&s.locales[a]||s;if("auto"===(t.frontmatter.sidebar||r.sidebar||s.sidebar))return function(t){var e=function(t){var e;return(t=t.map((function(t){return Object.assign({},t)}))).forEach((function(t){2===t.level?e=t:e&&(e.children||(e.children=[])).push(t)})),t.filter((function(t){return 2===t.level}))}(t.headers||[]);return[{type:"group",collapsable:!1,title:t.title,path:null,children:e.map((function(e){return{type:"auto",title:e.title,basePath:t.path,path:t.path+"#"+e.slug,children:e.children||[]}}))}]}(t);var o=r.sidebar||s.sidebar;if(o){var l=function(t,e){if(Array.isArray(e))return{base:"/",config:e};for(var n in e)if(0===(a=t,/(\.html|\/)$/.test(a)?a:a+"/").indexOf(encodeURI(n)))return{base:n,config:e[n]};var a;return{}}(e,o),c=l.base,f=l.config;return f?f.map((function(t){return function t(e,n,a){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1;if("string"==typeof e)return u(n,e,a);if(Array.isArray(e))return Object.assign(u(n,e[0],a),{title:e[1]});i>3&&console.error("[vuepress] detected a too deep nested sidebar group.");var s=e.children||[];return 0===s.length&&e.path?Object.assign(u(n,e.path,a),{title:e.title}):{type:"group",path:e.path,title:e.title,sidebarDepth:e.sidebarDepth,children:s.map((function(e){return t(e,n,a,i+1)})),collapsable:!1!==e.collapsable}}(t,i,c)})):[]}return[]}},507:function(t,e){t.exports="data:image/png;base64,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"},508:function(t,e,n){"use strict";var a=n(505),i=n(507),s=n.n(i),r=n(510),o=n.n(r),l={data:function(){return{alpha:0,transparent:!0}},computed:{localePath:function(){return this.$localePath},navs:function(){return(this.$themeLocaleConfig||{}).navs||[]},styles:function(){var t=this.$page.frontmatter.home?this.alpha:1,e={navbar:{backgroundColor:"rgba(255, 255, 255, ".concat(t,")")},word:{color:"rgba(255, 255, 255, 0.8)"},navClass:"nav__link",langClass:"nav__link",logo:s.a,logoStyle:{height:"50px"}};return t>=1&&(e.navbar.boxShadow="0px 2px 30px 0px rgba(0, 0, 0, 0.1)"),t>.3&&(e.logo=o.a,e.word.color="rgba(102, 102, 102, ".concat(t,")"),e.navClass="nav__link--white",e.langClass="nav__lang--white"),e}},mounted:function(){window.addEventListener("scroll",this.onScroll),this.alpha=0,this.transparent="/"===location.pathname},methods:{getNavClass:function(t,e){return this.$route.path===t&&"nav__link--white"===e?"nav__link--active":e},onScroll:function(){var t=window.scrollY;this.alpha=t/100},calTransparent:function(){this.transparent="/"===location.pathname},isExternal:a.a}},c=(n(511),n(69)),u=Object(c.a)(l,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("header",{style:t.styles.navbar},[n("nav",[n("router-link",{attrs:{to:t.localePath}},[n("img",{style:t.styles.logoStyle,attrs:{src:t.styles.logo,alt:"logo"}})]),t._v(" "),n("ul",{staticClass:"navs"},t._l(t.navs,(function(e,a){return n("li",{key:a,staticClass:"nav"},[t.isExternal(e.link)?n("a",{class:t.getNavClass(e.link,t.styles.navClass),style:t.styles.word,attrs:{href:e.link,target:"_blank",rel:"noopener noreferrer"}},[t._v(t._s(e.text))]):n("router-link",{class:t.getNavClass(e.link,t.styles.navClass),style:t.styles.word,attrs:{to:e.link}},[t._v(t._s(e.text)+"\n                ")]),t._v(" "),t.isExternal(e.link)?n("OutboundLink"):t._e()],1)})),0)],1)])}),[],!1,null,"e3902e94",null);e.a=u.exports},510:function(t,e,n){t.exports=n.p+"assets/img/logo_100.285fceb1.png"},511:function(t,e,n){"use strict";var a=n(502);n.n(a).a},512:function(t,e,n){},513:function(t,e,n){},514:function(t,e,n){},515:function(t,e,n){},516:function(t,e,n){},517:function(t,e,n){},527:function(t,e,n){},528:function(t,e,n){},536:function(t,e,n){t.exports=n.p+"assets/img/fastest-config.0fa92fde.svg"},537:function(t,e,n){"use strict";var a=n(512);n.n(a).a},538:function(t,e,n){"use strict";var a=n(513);n.n(a).a},539:function(t,e,n){"use strict";var a=n(514);n.n(a).a},540:function(t,e,n){"use strict";var a=n(515);n.n(a).a},541:function(t,e,n){"use strict";var a=n(516);n.n(a).a},546:function(t,e,n){"use strict";var a=n(517);n.n(a).a},563:function(t,e,n){"use strict";var a=n(527);n.n(a).a},564:function(t,e,n){"use strict";var a=n(528);n.n(a).a},621:function(t,e,n){"use strict";n.r(e);var a=n(508),i=n(536),s=n.n(i),r={computed:{title:function(){return"matman.js"},description:function(){return"web 端对端测试解决方案"},introductionLink:function(){return"/wiki"},introduction:function(){return"快速开始 →"},toWorkbenchLink:function(){return"https://github.com/matmanjs/matman"},getStarted:function(){return"管理平台"},starLink:function(){return"https://github.com/matmanjs/matman"},fockLink:function(){return"https://github.com/matmanjs/matman"},issuesLink:function(){return"https://github.com/matmanjs/matman/issues"},logoBig:function(){return s.a}}},o=(n(537),n(69)),l=Object(o.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"banner-inner"},[n("div",{staticClass:"left"},[n("h1",[t._v(t._s(t.title))]),t._v(" "),n("h2",[t._v(t._s(t.description))]),t._v(" "),n("ul",{staticClass:"entry"},[n("li",{staticClass:"left-btn"},[n("router-link",{attrs:{to:t.introductionLink}},[t._v("\n                    "+t._s(t.introduction)+"\n                ")])],1),t._v(" "),t.$themeConfig.rightBtn?n("li",{staticClass:"right-btn"},[n("a",{attrs:{href:t.toWorkbenchLink,target:"_blank"}},[t._v("\n                    "+t._s(t.getStarted)+"\n                ")])]):t._e()]),t._v(" "),n("ul",{staticClass:"github"},[t.starLink?n("li",{staticClass:"star"},[n("div",{staticClass:"button star--button"},[n("i",{staticClass:"icon star--icon"}),t._v(" "),n("a",{attrs:{href:t.starLink,target:"_blank"}},[t._v("Star")])])]):t._e(),t._v(" "),t.fockLink?n("li",{staticClass:"fork"},[n("div",{staticClass:"button fork--button"},[n("i",{staticClass:"icon fork--icon"}),t._v(" "),n("a",{attrs:{href:t.fockLink,target:"_blank"}},[t._v("Fork")])])]):t._e(),t._v(" "),t.issuesLink?n("li",{staticClass:"issue"},[n("div",{staticClass:"button issue--button"},[n("i",{staticClass:"icon issue--icon"}),t._v(" "),n("a",{attrs:{href:t.issuesLink,target:"_blank"}},[t._v("Issues")])])]):t._e()])]),t._v(" "),n("div",{staticClass:"right"},[n("img",{attrs:{src:t.logoBig}})])])}),[],!1,null,"466ec4f6",null).exports,c={computed:{flow:function(){return[{title:"纯 JavaScript",desc:"使用 JS 语言来写用例，无额外学习成本",backgroundImage:"http://res.imtt.qq.com/hippydoc/img/shazam.png"},{title:"简单易用 告别繁琐",desc:"测试框架提供多种场景支持，拿来即用",backgroundImage:"https://qpic.url.cn/feeds_pic/ajNVdqHZLLDWz4s3BrgQo4hJVBIQjzX97yYVYRFF3jyoNJzNpyXQLA/"},{title:"不只是测试UI",desc:"独有的数据快照模型，不仅可以测UI，还可以测接口请求、性能分析等",backgroundImage:"http://res.imtt.qq.com/hippydoc/img/home/icon-ft-4.png"}]}}},u=(n(538),Object(o.a)(c,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.flow.length?n("div",{staticClass:"flow"},t._l(t.flow,(function(e){return n("div",{staticClass:"flow-item"},[n("i",{staticClass:"flow-item__icon",style:{backgroundImage:"url('"+e.backgroundImage+"')"}}),t._v(" "),n("p",{staticClass:"flow-item__word"},[t._v(t._s(e.title))]),t._v(" "),n("p",{staticClass:"flow-item__desc"},[t._v(t._s(e.desc))])])})),0):t._e()}),[],!1,null,"2d530124",null).exports),f={computed:{title:function(){return"合作社区"},communities:function(){return[{logoPath:"https://11.url.cn/now/app/community-pc/img/IVWEB_flow_869e7914.png",href:"https://www.ivweb.io/"},{logoPath:"https://qpic.url.cn/feeds_pic/PiajxSqBRaELREfBGmf12pwe1J0WOY5Fao1Cs8EDdMREia1eV1Micw49g/",href:"https://feflowjs.com/"}]}}},p=(n(539),Object(o.a)(f,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.communities.length?n("div",{staticClass:"community"},[n("p",{staticClass:"index-title"},[t._v(t._s(t.title))]),t._v(" "),n("div",{staticClass:"divide"}),t._v(" "),n("ul",{staticClass:"community__list"},t._l(t.communities,(function(t,e){return n("li",{key:e,staticClass:"community__item"},[n("a",{attrs:{href:t.href,target:"_blank"}},[n("img",{attrs:{src:t.logoPath,width:"170",alt:"community logo"}})])])})),0)]):t._e()}),[],!1,null,"4e4e70ba",null).exports),h={computed:{title:function(){return"友情链接"},links:function(){return{name:"腾讯开源",href:"https://opensource.tencent.com/"}}}},d=(n(540),Object(o.a)(h,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.links.length?n("ul",{staticClass:"links"},[n("li",{staticClass:"links__item links__title"},[t._v(t._s(t.title))]),t._v(" "),t._l(t.links,(function(e,a){return n("li",{key:a,staticClass:"links__item"},[n("a",{attrs:{href:e.href,target:"_blank"}},[t._v(t._s(e.name))])])}))],2):t._e()}),[],!1,null,"95b00ebc",null).exports),v=(n(168),n(507)),g=n.n(v),m={computed:{footer:function(){return{lisence:"MIT",copyright:"© ".concat((new Date).getFullYear()," TENCENT IVWEB.All Rights Reserved"),repoLink:"https://github.com/matmanjs/matman"}},footerLogo:function(){return g.a}}},b=(n(541),Object(o.a)(m,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"copyright"},[n("div",{staticClass:"copyright__text"},[n("div",{staticClass:"copyright__logo"},[n("img",{attrs:{src:t.footerLogo}})]),t._v(" "),n("p",[t._v(t._s(t.footer.copyright))]),t._v(" "),n("p",[t._v("Documentation licensed under "+t._s(t.footer.lisence)+".")])]),t._v(" "),n("div",{staticClass:"copyright__group"},[n("a",{staticClass:"copyright__github",attrs:{href:t.footer.repoLink,target:"_blank"}})])])}),[],!1,null,"1cb4aca5",null).exports),k=n(0),S=n(620);k.default.use(S.a);var y={components:{Navbar:a.a,Banner:l,Feature:u,Community:p,Links:d,Copyright:b}},N=(n(546),Object(o.a)(y,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"theme-container"},[e("div",{staticClass:"layout__banner"},[e("div",{staticClass:"particles"},[e("vue-particles",{attrs:{color:"#eee",particleOpacity:.8,particlesNumber:80,shapeType:"circle",particleSize:4,linesColor:"#ddd",linesWidth:1,lineLinked:!0,lineOpacity:.4,linesDistance:150,moveSpeed:3,hoverEffect:!0,hoverMode:"grab",clickEffect:!0,clickMode:"push"}})],1),this._v(" "),e("Banner")],1),this._v(" "),e("div",{staticClass:"layout__description"},[e("Feature")],1),this._v(" "),e("div",{staticClass:"layout__community"},[e("Community")],1)])}),[],!1,null,"1755f912",null).exports),z=n(619),j=n(618),P={components:{Links:d,Copyright:b}},C=(n(563),Object(o.a)(P,(function(){var t=this.$createElement,e=this._self._c||t;return e("footer",{staticClass:"footer"},[e("div",{staticClass:"footer__links"},[e("Links")],1),this._v(" "),e("div",{staticClass:"footer__copyright"},[e("Copyright")],1)])}),[],!1,null,"46c6ac00",null).exports),O=n(505),E={components:{Home:N,Page:z.a,Sidebar:j.a,Navbar:a.a,Footer:C},data:function(){return{isSidebarOpen:!1}},computed:{shouldShowNavbar:function(){var t=this.$site.themeConfig;return!1!==this.$page.frontmatter.navbar&&!1!==t.navbar&&(this.$title||t.logo||t.repo||t.nav||this.$themeConfig.nav)},shouldShowSidebar:function(){var t=this.$page.frontmatter;return!t.home&&!1!==t.sidebar&&this.sidebarItems.length},sidebarItems:function(){return Object(O.b)(this.$page,this.$page.regularPath,this.$site,this.$localePath)},pageClasses:function(){var t=this.$page.frontmatter.pageClass;return[{"no-navbar":!this.shouldShowNavbar,"sidebar-open":this.isSidebarOpen,"no-sidebar":!this.shouldShowSidebar},t]}},mounted:function(){var t=this;this.$router.afterEach((function(){t.isSidebarOpen=!1}))},methods:{toggleSidebar:function(t){this.isSidebarOpen="boolean"==typeof t?t:!this.isSidebarOpen},onTouchStart:function(t){this.touchStart={x:t.changedTouches[0].clientX,y:t.changedTouches[0].clientY}},onTouchEnd:function(t){var e=t.changedTouches[0].clientX-this.touchStart.x,n=t.changedTouches[0].clientY-this.touchStart.y;Math.abs(e)>Math.abs(n)&&Math.abs(e)>40&&(e>0&&this.touchStart.x<=80?this.toggleSidebar(!0):this.toggleSidebar(!1))}}},L=(n(564),Object(o.a)(E,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"theme-container fastest-docs-container",class:t.pageClasses,on:{touchstart:t.onTouchStart,touchend:t.onTouchEnd}},[t.$page.frontmatter.home?n("div",{staticClass:"particles"},[n("vue-particles",{attrs:{color:"#eee",particleOpacity:.8,particlesNumber:40,shapeType:"circle",particleSize:4,linesColor:"#ddd",linesWidth:1,lineLinked:!0,lineOpacity:.4,linesDistance:150,moveSpeed:3,hoverEffect:!0,hoverMode:"grab",clickEffect:!0,clickMode:"push"}})],1):t._e(),t._v(" "),t.shouldShowNavbar?n("Navbar",{attrs:{transparent:t.$page.frontmatter.home},on:{"toggle-sidebar":t.toggleSidebar}}):t._e(),t._v(" "),n("div",{staticClass:"sidebar-mask",on:{click:function(e){return t.toggleSidebar(!1)}}}),t._v(" "),n("Sidebar",{attrs:{items:t.sidebarItems},on:{"toggle-sidebar":t.toggleSidebar}},[t._t("sidebar-top",null,{slot:"top"}),t._v(" "),t._t("sidebar-bottom",null,{slot:"bottom"})],2),t._v(" "),t.$page.frontmatter.home?n("Home"):n("Page",{attrs:{"sidebar-items":t.sidebarItems}},[t._t("page-top",null,{slot:"top"}),t._v(" "),t._t("page-bottom",null,{slot:"bottom"})],2),t._v(" "),t.$page.frontmatter.layout?n("div",{staticClass:"layout__content"},[n(t.$page.frontmatter.layout,{tag:"component"})],1):t._e(),t._v(" "),t.$page.frontmatter.home?n("Footer"):t._e()],1)}),[],!1,null,null,null));e.default=L.exports}}]);