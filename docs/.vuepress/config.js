module.exports = {
    // 构建生成的文件路径，相对于根目录而言
    dest: './docs-dist',

    // 设置站点根路径，否则静态资源路径会有问题
    base: '/matman/',

    // 添加 github 链接，用于 gh-pages -d dist 命令
    repo: 'https://github.com/matmanjs/matman',

    title: 'matman.js',
    description: 'web 端对端测试解决方案',
    head: [
        ['link', { rel: 'icon', href: `/logo.png` }]
    ],
    themeConfig: {
        locales: {
            '/': {
                navs: [
                    { text: 'web端对端测试方案', link: '/wiki/' },
                    { text: 'API手册', link: '/api/' },
                    { text: '发布日志', link: '/release/' },
                    { text: 'Issues', link: 'https://github.com/matmanjs/matman/issues' }
                ],
                sidebar: {
                    '/wiki/': [
                        {
                            title: '关于 matman',
                            path: '/wiki/',
                            collapsable: false
                        },
                        {
                            title: '安装和升级',
                            path: '/wiki/install',
                            collapsable: false
                        },
                        {
                            title: '快速入门',
                            path: '/wiki/getting-started/',
                            collapsable: false,
                            children: [
                                'getting-started/baidu_01',
                                'getting-started/baidu_02'
                            ]
                        },
                        {
                            title: '基本理论',
                            collapsable: false,
                            children: [
                                'basic-concepts/page-snapshot',
                                'basic-concepts/data-snapshot',
                                'basic-concepts/test-by-mock'
                            ]
                        }
                    ],
                    '/api/': [
                        {
                            title: 'API说明',
                            path: '/api/'
                        },
                        {
                            title: 'matman.config.js 配置',
                            path: '/api/matman-config'
                        },
                        {
                            title: '爬虫工具：web-crawl-util',
                            path: '/api/web-crawl-util'
                        },
                        {
                            title: '页面交互函数',
                            path: '/api/interact-with-the-page'
                        }
                    ],
                    '/release/': true
                }
            }
        }
    }
};
