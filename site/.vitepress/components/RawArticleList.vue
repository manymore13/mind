<script setup lang="ts">
import { data as rawArticles } from '../raw.data.mts'

function formatDate(date: string | null): string {
  if (!date) return '未知日期'
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
</script>

<template>
  <div class="raw-article-list">
    <div v-if="rawArticles.length === 0" class="empty-tip">
      暂无文章
    </div>
    <div v-else class="article-items">
      <a
        v-for="article in rawArticles"
        :key="article.url"
        :href="article.url"
        class="article-item"
      >
        <div class="article-title">{{ article.title }}</div>
        <div class="article-meta">
          <span class="article-date">{{ formatDate(article.date) }}</span>
          <span v-if="article.tags.length" class="article-tags">
            <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
          </span>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.raw-article-list {
  margin-top: 1rem;
}

.empty-tip {
  color: var(--vp-c-text-2);
  font-style: italic;
}

.article-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.article-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.25s, background-color 0.25s;
}

.article-item:hover {
  border-color: var(--vp-c-brand);
  background-color: var(--vp-c-bg-soft);
}

.article-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.article-tags {
  display: flex;
  gap: 0.35rem;
}

.tag {
  padding: 0.1rem 0.45rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 4px;
  font-size: 0.8rem;
}
</style>
