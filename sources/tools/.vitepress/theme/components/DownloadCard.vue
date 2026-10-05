<template>
  <a class="download-card" :href="withBase(href)" download>
    <span class="download-card__platform">{{ platform }}</span>
    <span class="download-card__file">{{ file }}</span>
    <span class="download-card__note">{{ note }}</span>
  </a>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{
  /** 平台名，例如 Edge 扩展 */
  platform: string
  /** 下载文件名 */
  file: string
  /** 补充说明 */
  note: string
  /** 下载链接，相对 base，例如 /downloads/xxx.zip */
  href: string
}>()
</script>
