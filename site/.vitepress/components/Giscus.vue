<script setup lang="ts">
import { useData } from 'vitepress'
import { watch, onMounted, ref } from 'vue'

const { isDark } = useData()
const giscusContainer = ref<HTMLElement | null>(null)

// Giscus configuration
// TODO: Replace with your own Giscus configuration from https://giscus.app/
const giscusConfig = {
  repo: 'manymore13/mind-river',
  repoId: 'R_kgDOR90hPg',
  category: 'Announcements',
  categoryId: 'DIC_kwDOR90hPs4C6c0t',
  mapping: 'pathname',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'bottom',
  theme: 'preferred_color_scheme',
  lang: 'zh-CN',
  loading: 'lazy'
}

function loadGiscus() {
  if (!giscusContainer.value) return

  // Clear existing giscus
  giscusContainer.value.innerHTML = ''

  // Create giscus iframe
  const iframe = document.createElement('iframe')
  iframe.src = `https://giscus.app/client.js?repo=${giscusConfig.repo}&repoId=${giscusConfig.repoId}&category=${giscusConfig.category}&categoryId=${giscusConfig.categoryId}&mapping=${giscusConfig.mapping}&reactionsEnabled=${giscusConfig.reactionsEnabled}&emitMetadata=${giscusConfig.emitMetadata}&inputPosition=${giscusConfig.inputPosition}&theme=${isDark.value ? 'dark' : 'light'}&lang=${giscusConfig.lang}&loading=${giscusConfig.loading}`
  iframe.setAttribute('width', '100%')
  iframe.setAttribute('height', '400')
  iframe.setAttribute('scrolling', 'no')
  iframe.setAttribute('title', 'comments')
  iframe.style.border = 'none'
  iframe.style.marginTop = '1rem'

  giscusContainer.value.appendChild(iframe)
}

onMounted(() => {
  loadGiscus()
})

watch(isDark, () => {
  loadGiscus()
})
</script>

<template>
  <div class="giscus-container">
    <div ref="giscusContainer" class="giscus"></div>
  </div>
</template>

<style scoped>
.giscus-container {
  margin-top: 2rem;
  padding-top: 1rem;
}

</style>
