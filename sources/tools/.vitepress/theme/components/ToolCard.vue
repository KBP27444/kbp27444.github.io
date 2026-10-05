<template>
  <a class="tool-card" :href="withBase(tool.link)">
    <div class="tool-card__head">
      <span class="tool-card__icon" aria-hidden="true">{{ tool.icon }}</span>
      <h3 class="tool-card__name">{{ tool.name }}</h3>
    </div>

    <p class="tool-card__summary">{{ tool.summary }}</p>

    <div class="tool-card__foot">
      <div class="tool-card__tags">
        <span
          v-for="platform in tool.platforms"
          :key="platform.label"
          class="tool-tag"
          :title="platform.title || platform.label"
        >
          {{ platform.label }}
        </span>
        <span v-if="tool.version" class="tool-card__version">{{ tool.version }}</span>
      </div>
      <span class="tool-card__more">查看详情 →</span>
    </div>
  </a>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress'
import type { ToolItem } from '../toolCatalog'

defineProps<{ tool: ToolItem }>()
</script>
