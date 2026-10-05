<template>
  <div class="tools-home">
    <div class="tools-home__inner">
      <!-- 左侧分类栏 -->
      <aside class="tools-nav" aria-label="工具分类">
        <p class="tools-nav__title">工具分类</p>
        <div class="segmented" role="tablist">
          <button
            v-for="item in navItems"
            :key="item.id"
            type="button"
            role="tab"
            class="segmented__item"
            :class="{ 'is-active': activeId === item.id }"
            :aria-selected="activeId === item.id"
            @click="select(item.id)"
          >
            <span class="segmented__icon" aria-hidden="true">{{ item.icon }}</span>
            <span class="segmented__label">{{ item.label }}</span>
            <span v-if="item.count" class="segmented__count">{{ item.count }}</span>
          </button>
        </div>
      </aside>

      <!-- 右侧卡片网格 -->
      <section class="tools-panel">
        <header class="tools-panel__head">
          <h2 class="tools-panel__title">
            <span aria-hidden="true">{{ activeCategory.icon }}</span>
            {{ activeCategory.label }}
          </h2>
          <p class="tools-panel__desc">{{ activeCategory.desc }}</p>
        </header>

        <div v-if="activeCategory.tools.length" class="tool-grid">
          <ToolCard v-for="tool in activeCategory.tools" :key="tool.link" :tool="tool" />
        </div>
        <p v-else class="tool-empty">该分类下的工具正在整理中，敬请期待 🚧</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { inBrowser, useRoute } from 'vitepress'
import ToolCard from './ToolCard.vue'
import { allTools, categories, type ToolCategory } from '../toolCatalog'

const route = useRoute()

/** 默认先看第一个真实分类（本次就是 OJ 刷题）；/tools/all/ 页面默认看全部 */
const activeId = ref('all')

const navItems = computed(() => [
  { id: 'all', label: '全部工具', icon: '🗂', count: allTools.length },
  ...categories.map((category) => ({
    id: category.id,
    label: category.label,
    icon: category.icon,
    count: category.tools.length
  }))
])

const activeCategory = computed<ToolCategory>(() => {
  if (activeId.value === 'all') {
    return {
      id: 'all',
      label: '全部工具',
      icon: '🗂',
      desc: '把手上这些自研小工具集中放在这里，每个都附带安装教程和常见问题。',
      tools: allTools
    }
  }
  return (
    categories.find((category) => category.id === activeId.value) ??
    categories[0] ?? {
      id: 'empty',
      label: '暂无工具',
      icon: '🚧',
      desc: '',
      tools: []
    }
  )
})

/** 只有 URL 上带 ?c=xxx 时才采纳，避免首页默认落到 OJ 分类而忽略「全部」 */
function applyQuery() {
  const id = readQuery()
  if (id && navItems.value.some((item) => item.id === id)) {
    activeId.value = id
  }
}

function readQuery(): string {
  if (!inBrowser) return ''
  return new URLSearchParams(window.location.search).get('c') || ''
}

function select(id: string) {
  activeId.value = id
  if (!inBrowser) return
  const url = new URL(window.location.href)
  url.searchParams.set('c', id)
  // 只改地址栏，不触发 VitePress 路由重载
  window.history.replaceState(window.history.state, '', url.toString())
}

onMounted(applyQuery)
watch(() => route.path, applyQuery)
</script>
