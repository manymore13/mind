import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import RawArticleList from '../components/RawArticleList.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app }) {
    app.component('RawArticleList', RawArticleList)
  }
} satisfies Theme
