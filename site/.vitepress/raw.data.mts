import { createContentLoader } from 'vitepress'

export default createContentLoader('raw/*.md', {
  includeSrc: true,
  render: false,
  excerpt: false,
  transform(raw) {
    return raw
      .filter((item) => item.url !== '/raw/')
      .map((item) => {
        // title: frontmatter > first h1 > filename
        const title =
          item.frontmatter.title ||
          extractFirstH1(item.src) ||
          fileNameToTitle(item.url)

        // date: frontmatter > null (will be shown as "未知日期")
        const date = item.frontmatter.date || null

        const tags: string[] = item.frontmatter.tags || []

        return { title, date, tags, url: item.url }
      })
      .sort((a, b) => {
        if (!a.date) return 1
        if (!b.date) return -1
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
  }
})

function extractFirstH1(src: string | undefined): string | null {
  if (!src) return null
  const match = src.match(/^#\s+(.+)$/m)
  return match ? match[1].replace(/\*\*/g, '').trim() : null
}

function fileNameToTitle(url: string): string {
  const segments = url.split('/')
  const file = segments[segments.length - 1] || '未命名'
  return decodeURIComponent(file).replace(/[-_]/g, ' ')
}
