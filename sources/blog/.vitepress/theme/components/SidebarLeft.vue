<template>
  <div class="sidebar-left-inner">
    <!-- 头像 -->
    <div class="avatar">
      <img src="/avatar.png" alt="avatar" />
    </div>
    <div class="nickname">KBP</div>

    <!-- 导航 -->
    <nav class="nav">
      <a href="/blog/">文章</a>
      <a href="/blog/archive">归档</a>
      <a href="/blog/tags">标签</a>
      <a href="/blog/friends">友链</a>
      <a href="/blog/about">关于</a>
    </nav>

    <!-- 主题切换 -->
    <div class="theme-switcher">
      <span @click="setTheme('light')">☀️</span>
      <span @click="setTheme('auto')">🌓</span>
      <span @click="setTheme('dark')">🌙</span>
    </div>

    <!-- GitHub 链接 -->
    <div class="github-link">
      <a href="https://github.com/KBP27444" target="_blank">GitHub</a>
    </div>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'

const { theme } = useData()

function setTheme(mode) {
  // 设置 VitePress 主题
  // 简单方式：写入 localStorage
  localStorage.setItem('vitepress-theme-appearance', mode)
  // 应用主题
  const html = document.documentElement
  if (mode === 'dark') {
    html.classList.add('dark')
  } else if (mode === 'light') {
    html.classList.remove('dark')
  } else {
    // auto
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    html.classList.toggle('dark', prefersDark)
  }
}
</script>

<style scoped>
.sidebar-left-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--vp-c-brand);
}
.nickname {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 10px;
  color: var(--vp-c-text-1);
}
.nav {
  margin-top: 25px;
  width: 100%;
}
.nav a {
  display: block;
  padding: 8px 0;
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
}
.nav a:hover,
.nav a.active {
  color: var(--vp-c-brand);
}
.theme-switcher {
  margin-top: 30px;
  display: flex;
  gap: 10px;
  font-size: 1.2rem;
}
.theme-switcher span {
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}
.theme-switcher span:hover {
  opacity: 1;
}
.github-link {
  margin-top: 20px;
}
.github-link a {
  color: var(--vp-c-text-3);
  text-decoration: none;
  font-size: 0.9rem;
}
.github-link a:hover {
  color: var(--vp-c-brand);
}
</style>