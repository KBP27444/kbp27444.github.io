<template>
  <div class="article-item">
    <div class="meta">
      <span class="date">{{ post.date }}</span>
      <span class="category">{{ post.category }}</span>
      <span class="word-count">{{ post.wordCount }}字</span>
    </div>
    <h2><a :href="post.path">{{ post.title }}</a></h2>
  </div>
</template>

<script setup>
defineProps(['post'])
</script>

<style scoped>
.article-item {
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 16px;
}
.meta {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  display: flex;
  gap: 12px;
}
.article-item h2 {
  margin: 6px 0 0;
  font-size: 1.3rem;
  font-weight: 500;
}
.article-item h2 a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}
.article-item h2 a:hover {
  color: var(--vp-c-brand);
}
</style>