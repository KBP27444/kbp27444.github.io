<template>
  <a class="back-to-list" :href="withBase(to)">
    <span aria-hidden="true">←</span>
    <span>{{ label }}</span>
  </a>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{
  /** 目标路由，相对 base 的绝对路径，例如 /all/ */
  to: string
  label: string
}>()
</script>
