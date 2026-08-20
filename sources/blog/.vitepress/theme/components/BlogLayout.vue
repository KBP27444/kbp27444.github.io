<template>
  <div class="blog-layout">
    <!-- 左侧边栏 -->
    <aside class="sidebar-left">
      <SidebarLeft />
    </aside>

    <!-- 中间内容 -->
    <main class="main-content">
      <div class="vp-doc">
        <Content />  <!-- VitePress 内置组件，显示当前页面的内容 -->
      </div>
    </main>

    <!-- 右侧边栏 -->
    <aside class="sidebar-right">
      <SidebarRight />
    </aside>
  </div>
</template>

<script setup>
import { Content } from 'vitepress'
import SidebarLeft from './SidebarLeft.vue'
import SidebarRight from './SidebarRight.vue'
import { useData } from 'vitepress'
import { computed } from 'vue'

const { page } = useData()
// 如果是首页，我们可以显示文章列表，但内容由 index.md 决定，所以我们可以在 index.md 中放一个组件
// 或者直接在 layout 中判断并渲染文章列表，但为了灵活，我们让 index.md 使用一个特殊组件
</script>

<style scoped>
.blog-layout {
  display: flex;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}
.sidebar-left {
  width: 220px;
  flex-shrink: 0;
  padding: 30px 0 30px 10px;
  border-right: 1px solid var(--vp-c-divider);
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
.main-content {
  flex: 1;
  padding: 30px 40px;
  min-height: 100vh;
}
.sidebar-right {
  width: 260px;
  flex-shrink: 0;
  padding: 30px 10px 30px 20px;
  border-left: 1px solid var(--vp-c-divider);
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
@media (max-width: 960px) {
  .sidebar-left { display: none; }
  .sidebar-right { display: none; }
  .main-content { padding: 20px; }
}
</style>