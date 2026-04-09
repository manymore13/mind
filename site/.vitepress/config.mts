import { defineConfig } from 'vitepress'
import nav from './nav'
import sidebar from './sidebar'
import syncRawPlugin from '../scripts/sync-raw-plugin.mjs'

export default defineConfig({
  title: 'Personal Knowledge Base',
  description: 'A personal website for knowledge management',

  // Base path for GitHub Pages deployment with custom domain
  base: '/',

  // Output directory
  outDir: 'dist',
  cacheDir: '.vitepress/cache',

  // Theme configuration
  themeConfig: {
    nav,
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/manymore13/' }
    ],
    footer: {
      message: 'Built with VitePress',
      copyright: 'Copyright © 2026'
    }
  },

  // Markdown configuration
  markdown: {
    lineNumbers: true
  },

  // Head configuration
  head: [
    ['meta', { name: 'theme-color', content: '#10b981' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap' }],
  ],

  // Build configuration
  cleanUrls: false,
  lastUpdated: true,
  sitemap: {
    hostname: 'https://mind.value888.site',
  },

  // Ignore dead links for now
  ignoreDeadLinks: true,

  // Vite plugins
  vite: {
    plugins: [syncRawPlugin()],
  },
})
