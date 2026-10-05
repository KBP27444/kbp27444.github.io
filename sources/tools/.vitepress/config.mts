import { defineConfig } from 'vitepress'

// 站点主色，与首页 index.html 的 #1e2a3a 保持一致
const BRAND = '#1e2a3a'
const BRAND_HOVER = '#2c3e5a'
// 与 tools.css 里的强调色保持同步
const ACCENT = '#3b82f6'

export default defineConfig({
  base: '/tools/',
  title: '实用工具',
  description: 'KBP 自研小工具：Edge 扩展、VSCode 扩展等，附安装教程与常见问题',

  ignoreDeadLinks: true,

  // public/ 只用于存放下载包等静态文件，不要当成内容页去构建
  srcExclude: ['public/**'],

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    [
      'style',
      {},
      `
      :root {
        --vp-c-brand: ${BRAND};
        --vp-c-brand-light: ${BRAND_HOVER};
        --vp-c-brand-lighter: ${BRAND_HOVER};
        --vp-c-brand-dark: ${BRAND};
        --vp-c-brand-darker: #16202c;
        --vp-c-brand-1: ${BRAND};
        --vp-c-brand-2: ${BRAND_HOVER};
        --vp-c-brand-3: ${BRAND};
        --vp-c-brand-soft: #eef2f7;
        --vp-c-brand-softer: #f5f8fb;
        /* 侧栏激活态：深蓝竖条 + 深蓝文字，与首页分段控制器同一套视觉语言 */
        --vp-sidebar-item-active-color: ${BRAND};
        --vp-sidebar-item-active-bg: #eef2f7;
      }
      .dark {
        --vp-c-brand-1: #9fb3cc;
        --vp-c-brand-2: #b7c7db;
        --vp-c-brand-3: #8ba3c0;
        --vp-c-brand-soft: rgba(159, 179, 204, 0.16);
      }
      .VPButton.brand {
        background-color: ${BRAND} !important;
        border-color: ${BRAND} !important;
        border-radius: 10px !important;
      }
      .VPButton.brand:hover {
        background-color: ${BRAND_HOVER} !important;
        border-color: ${BRAND_HOVER} !important;
      }
      .vp-doc a {
        color: ${BRAND};
      }
      .vp-doc a:hover {
        color: ${ACCENT};
      }
      `
    ]
  ],

  themeConfig: {
    siteTitle: '🛠 实用工具',

    nav: [
      { text: '全部工具', link: '/all/' },
      { text: '首页', link: '/' },
      { text: '我的博客', link: 'https://kbp.cc.cd/blog/' },
      { text: 'OI 笔记', link: 'https://kbp.cc.cd/oi-notes/' }
    ],

    // 详情页使用 VitePress 原生侧栏（与首页分段控制器共用同一套配色）
    // 以后新增分类，在下面追加一个分组即可，和 tools.data.ts 的分类一一对应
    sidebar: [
      { text: '🗂 全部工具', link: '/all/' },
      {
        text: '📝 OJ 刷题',
        items: [
          { text: 'OJ 题目一键转 Markdown', link: '/oj-extractor/' },
          { text: '安装与常见问题', link: '/oj-extractor/faq' }
        ]
      }
    ],

    outline: { level: [2, 3], label: '本页目录' },

    docFooter: { prev: '上一篇', next: '下一篇' },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: { dateStyle: 'short', timeStyle: 'short' }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/KBP27444/kbp27444.github.io' }
    ],

    footer: {
      message: '本项目仅供个人学习使用，请遵守目标平台的使用条款。',
      copyright: 'KBP 的资源站 · <a href="https://kbp.cc.cd/">返回主页</a>'
    },

    search: {
      provider: 'local',
      options: { detailedView: true, maxResults: 20 }
    }
  }
})
