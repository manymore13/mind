import type { DefaultTheme } from 'vitepress'

export default {
  '/raw/': [
    {
      text: '原始资料',
      items: [
        { text: '文章列表', link: '/raw/' },
        { text: '如何构建个人知识库', link: '/raw/how-to-build-knowledge-base' },
        { text: '猎豹移动全球化扩张战略与产品认知管理深度研究报告', link: '/raw/学习猎豹产品哲学与出海' }
      ]
    }
  ],
  '/wiki/': [
    {
      text: '知识库',
      items: [
        { text: '概念', link: '/wiki/concepts/' },
        { text: '主题', link: '/wiki/topics/' },
        { text: '笔记', link: '/wiki/notes/' },
      ]
    },
    {
      text: '概念',
      collapsed: true,
      items: [
        { text: '知识管理', link: '/wiki/concepts/knowledge-management' },
        { text: '第二大脑', link: '/wiki/concepts/second-brain' },
        { text: '笔记方法', link: '/wiki/concepts/note-taking' },
        { text: '卡片盒笔记法', link: '/wiki/concepts/zettelkasten' },
      ]
    }
  ],
  '/blog/': [
    {
      text: '博客',
      items: [
        { text: '所有文章', link: '/blog/' }
      ]
    },
    {
      text: '文章',
      collapsed: true,
      items: [
        { text: '欢迎来到我的博客', link: '/blog/posts/welcome' }
      ]
    }
  ],
  '/projects/': [
    {
      text: '项目',
      items: [
        { text: '所有项目', link: '/projects/' }
      ]
    },
    {
      text: '项目列表',
      collapsed: true,
      items: [
        { text: '个人知识库网站', link: '/projects/demos/knowledge-base-site' }
      ]
    }
  ],
} satisfies DefaultTheme.Sidebar
