<template>
  <div class="home">
    <div class="category-bar">
      <span>全部分类</span>
      <span class="filter-icon">📂</span>
    </div>
    <div class="article-list">
      <ArticleItem v-for="post in posts" :key="post.url" :post="post" />
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { withBase } from 'vitepress'
import ArticleItem from './ArticleItem.vue'
import { data as postsData } from '../posts.data'

const allPosts = ref(postsData)
const currentPage = ref(1)
const pageSize = 5

const posts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return allPosts.value
    .slice(start, start + pageSize)
    .map((post) => ({
      ...post,
      path: withBase(post.url),
      date: post.dateText
    }))
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(allPosts.value.length / pageSize))
)

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
</script>

<style scoped>
.category-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.filter-icon {
  cursor: pointer;
  font-size: 1.2rem;
}
.article-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.pagination {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  align-items: center;
}
.pagination button {
  padding: 6px 16px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  cursor: pointer;
}
.pagination button:hover:not(:disabled) {
  background: var(--vp-c-brand-soft);
}
.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>