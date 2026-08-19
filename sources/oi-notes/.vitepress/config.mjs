import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/oi-notes/',
  // srcDir: 'docs',
  title: "OI 笔记站",
  description: "备战 NOIP 的知识库",

  head: [
    ['script', { src: '//cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js', defer: true }]
  ],

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
            { text: '排序', link: '/算法/排序/' },
            { text: '分治', link: '/算法/分治/' }
          ]
        }
      ],
      '/数据结构/': [
        {
          text: '数据结构',
          items: [
            { text: 'ST表', link: '/数据结构/ST表/' },
            { text: '并查集', link: '/数据结构/并查集/' },
            { text: '栈', link: '/数据结构/栈/' },
            { text: '线段树', link: '/数据结构/线段树/' },
            { text: '普及数据结构', link: '/数据结构/普及组/' }
          ]
        }
      ],
      '/图论/': [
        {
          text: '图论',
          items: [
            { text: '最短路', link: '/图论/最短路/' },
            { text: '最小生成树', link: '/图论/最小生成树/' },
            { text: '二分图', link: '/图论/二分图/' },
            { text: 'LCA', link: '/图论/LCA/' },
            { text: '普及组树与图', link: '/图论/普及组/' }
          ]
        }
      ],
      '/动态规划/': [
        {
          text: '动态规划',
          items: [
            { text: '动态规划', link: '/动态规划/基础/动态规划' },
            { text: 'DP', link: '/动态规划/基础/DP' }
          ]
        }
      ],
      '/数学/': [
        {
          text: '数学',
          items: [
            { text: '初等数论', link: '/数学/数论/' },
            { text: '组合与线代', link: '/数学/组合/' },
            { text: '普及组数论与组合计数', link: '/数学/数论/slide(4)' }
          ]
        }
      ],
      '/字符串/': [
        {
          text: '字符串',
          items: [
            { text: 'Trie', link: '/字符串/Trie/' },
            { text: '哈希', link: '/字符串/哈希/' },
            { text: 'string', link: '/字符串/基础/string' },
            { text: '普及组字符串', link: '/字符串/普及组/' },
            { text: '字符串专题', link: '/字符串/专题/' }
          ]
        }
      ],
      '/搜索/': [
        {
          text: '搜索',
          items: [
            { text: 'DFS与BFS', link: '/搜索/DFS-BFS/' },
            { text: '搜索与剪枝', link: '/搜索/剪枝/' }
          ]
        }
      ],
      '/杂项/': [
        {
          text: '杂项',
          items: [
            { text: '杂项', link: '/杂项/' }
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