import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/blog/',
  title: '我的博客',
  description: '记录技术与生活',

  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['style', {}, `
      :root {
        --vp-c-brand: #3b82f6;
        --vp-c-brand-light: #60a5fa;
        --vp-c-brand-dark: #2563eb;
        --vp-c-brand-1: #3b82f6;
        --vp-c-brand-2: #2563eb;
      }
      .VPHero .name {
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .VPHero .actions .VPButton.brand {
        background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
        border: none !important;
        border-radius: 50px !important;
        padding: 12px 32px !important;
      }
    `]
  ],
  themeConfig: {
    siteTitle: '📝 我的博客',
    nav: [
      { text: '文章', link: '/' },
      { text: '归档', link: '/blog/archive' },
      { text: '标签', link: '/blog/tags' },
      { text: '友链', link: '/blog/friends' }, 
      { text: '关于', link: '/blog/about' }
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