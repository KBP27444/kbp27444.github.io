import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/blog/',
  title: "我的博客",
  description: "记录技术与生活",
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '归档', link: '/archive' }
    ],
    sidebar: [
      {
        text: '文章',
        items: [
          { text: '第一篇博文', link: '/posts/first' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/KBP27444' }
    ]
  }
})