<template>
  <div class="sidebar-right-inner">
    <!-- 搜索框 -->
    <div class="search-box">
      <input type="text" placeholder="搜索" v-model="keyword" @input="search" />
    </div>

    <!-- 博客统计 -->
    <div class="stats">
      <h3>博客统计</h3>
      <div class="stat-item"><span>运营时长</span><span>{{ stats.days }}</span></div>
      <div class="stat-item"><span>上次更新</span><span>{{ stats.lastUpdate }}</span></div>
      <div class="stat-item"><span>总字数</span><span>{{ stats.wordCount }}</span></div>
    </div>

    <!-- 标签云 -->
    <div class="tags">
      <h3>标签云</h3>
      <div class="tag-list">
        <span v-for="(count, tag) in tags" :key="tag" class="tag">
          {{ tag }} {{ count }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { data as posts } from '../posts.data'

const keyword = ref('')

const stats = computed(() => {
  if (!posts.length) {
    return { days: '暂无文章', lastUpdate: '暂无更新', wordCount: '0' }
  }

  const earliestDate = new Date(posts[posts.length - 1].date)
  const latestDate = new Date(posts[0].date)
  const totalWords = posts.reduce((sum, post) => sum + post.wordCount, 0)

  const now = new Date()
  const diffDays = Math.floor((now - earliestDate) / (1000 * 60 * 60 * 24))
  let daysStr = ''
  if (diffDays < 30) {
    daysStr = diffDays + '天'
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    const days = diffDays % 30
    daysStr = months + '个月' + (days > 0 ? days + '天' : '')
  } else {
    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)
    daysStr = years + '年' + (months > 0 ? months + '个月' : '')
  }

  const diffUpdate = Math.floor((now - latestDate) / (1000 * 60 * 60 * 24))
  const lastUpdateStr =
    diffUpdate === 0 ? '今天' : diffUpdate === 1 ? '昨天' : diffUpdate + '天前'

  return {
    days: daysStr,
    lastUpdate: lastUpdateStr,
    wordCount:
      totalWords > 10000 ? (totalWords / 10000).toFixed(2) + '万' : totalWords + ''
  }
})

const tags = computed(() => {
  const tagCount = {}
  for (const post of posts) {
    for (const tag of post.tags) {
      tagCount[tag] = (tagCount[tag] || 0) + 1
    }
  }
  return tagCount
})

function search() {
  if (keyword.value.trim()) {
    // 使用 VitePress 的搜索 API，这里简单跳转
    window.location.href = '/blog/?search=' + encodeURIComponent(keyword.value)
  }
}
</script>

<style scoped>
.sidebar-right-inner {
  padding: 0 5px;
}
.search-box input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
}
.search-box input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}
.stats, .tags {
  margin-top: 25px;
}
h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}
.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
.stat-item span:last-child {
  color: var(--vp-c-text-1);
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tag {
  background: var(--vp-c-bg-soft);
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: background 0.2s;
}
.tag:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
}
</style>