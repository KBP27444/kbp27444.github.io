import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/OI笔记站/',
  // srcDir: 'docs',
  title: "我的 OI 笔记",
  description: "备战 NOIP 的知识库",

  themeConfig: {
    nav: [
      { text: '📖 目录', link: '/目录' },
      { text: '首页', link: '/' },
      { text: '算法', link: '/算法/' },
      { text: '数据结构', link: '/数据结构/' },
      { text: '图论', link: '/图论/' },
      { text: '动态规划', link: '/动态规划/' },
      { text: '数学', link: '/数学/' },
      { text: '字符串', link: '/字符串/' },
      { text: '搜索', link: '/搜索/' }
    ],

    sidebar: {
      '/算法/': [
        {
          text: '算法',
          items: [
            { text: '排序', link: '排序/' },
            { text: '分治', link: '分治/' }
          ]
        }
      ],
      '/数据结构/': [
        {
          text: '数据结构',
          items: [
            { text: 'ST表', link: 'ST表/' },
            { text: '并查集', link: '并查集/' },
            { text: '栈', link: '栈/' },
            { text: '线段树', link: '线段树/' },
            { text: '普及数据结构', link: '普及组/' }
          ]
        }
      ],
      '/图论/': [
        {
          text: '图论',
          items: [
            { text: '最短路', link: '最短路/' },
            { text: '最小生成树', link: '最小生成树/' },
            { text: '二分图', link: '二分图/' },
            { text: 'LCA', link: 'LCA/' },
            { text: '普及组树与图', link: '普及组/' }
          ]
        }
      ],
      '/动态规划/': [
        {
          text: '动态规划',
          items: [
            { text: '动态规划', link: '基础/动态规划' },   // 修正：去掉开头的 '动态规划/'
            { text: 'DP', link: '基础/DP' }                // 修正：去掉开头的 '动态规划/'
          ]
        }
      ],
      '/数学/': [
        {
          text: '数学',
          items: [
            { text: '初等数论', link: '数论/' },                  // 修正：去掉 '数学/'
            { text: '组合与线代', link: '组合/' },                // 修正：去掉 '数学/'
            { text: '普及组数论与组合计数', link: '数论/普及组数论与组合计数' }  // 修正：去掉开头的 '数学/'
          ]
        }
      ],
      '/字符串/': [
        {
          text: '字符串',
          items: [
            { text: 'Trie', link: 'Trie/' },                 // 修正：去掉 '字符串/'
            { text: '哈希', link: '哈希/' },                 // 修正：去掉 '字符串/'
            { text: 'string', link: '基础/string' },         // 修正：去掉 '字符串/'
            { text: '普及组字符串', link: '普及组/' },       // 修正：去掉 '字符串/'
            { text: '字符串专题', link: '专题/' }             // 修正：去掉 '字符串/'
          ]
        }
      ],
      '/搜索/': [
        {
          text: '搜索',
          items: [
            { text: 'DFS与BFS', link: 'DFS-BFS/' },          // 修正：去掉 '搜索/'
            { text: '搜索与剪枝', link: '剪枝/' }            // 修正：去掉 '搜索/'
          ]
        }
      ],
      '/杂项/': [
        {
          text: '杂项',
          items: [
            { text: '杂项', link: '杂项/' }                 // 已经是相对路径，无需修改
          ]
        }
      ]
    },

    search: {
      provider: 'local',
      options: {
        detailedView: true,
        maxResults: 20
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/KBP27444/kbp27444.github.io' }
    ]
  }
})