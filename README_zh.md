# LLM Wiki

基于 VitePress 构建的个人知识库，专为 LLM 辅助的知识管理而设计。

[English](README.md)

## 核心理念

与传统 RAG（每次查询都从原始文档检索）不同，LLM **增量构建并维护一个持久的 Wiki**。当你添加新内容时，LLM 会阅读、提取关键信息，并整合到现有的 Wiki 中 —— 更新实体页面、修订主题摘要、维护交叉引用。

Wiki 是一个**持久累积的知识产物**。知识被编译一次并持续更新，而非每次查询都重新推导。

## 架构

```
┌─────────────────────────────────────────────────────────┐
│  原始资源 (raw/)                                         │
│  不可变的原始文档 —— 你整理的内容集合                      │
└─────────────────────────────────────────────────────────┘
                           ↓ LLM 读取并处理
┌─────────────────────────────────────────────────────────┐
│  知识库 (site/wiki/)                                     │
│  LLM 维护的结构化页面                                     │
│  摘要、概念、主题、交叉引用                                │
└─────────────────────────────────────────────────────────┘
                           ↓ VitePress 构建
┌─────────────────────────────────────────────────────────┐
│  静态网站                                                │
│  以网站形式浏览你的知识库                                  │
└─────────────────────────────────────────────────────────┘
```

## 目录结构

```
github_blog/
├── README.md           # 英文文档
├── README_zh.md        # 中文文档
├── LICENSE             # MIT 许可证
├── llm-wiki.md         # 设计文档
│
├── raw/                # 原始资源（你维护）
│   ├── index.md
│   ├── *.md            # 原始文章/笔记
│   └── assets/         # 图片等资源
│
└── site/               # 网站源码
    ├── .vitepress/     # VitePress 配置
    ├── wiki/           # 知识库（LLM 维护）
    │   ├── concepts/   # 概念定义页
    │   ├── topics/     # 主题探索页
    │   └── notes/      # 阅读笔记和摘要
    ├── blog/           # 博客文章
    ├── projects/       # 项目展示
    ├── scripts/        # 构建脚本
    └── package.json
```

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/your-username/llm-wiki.git
cd llm-wiki

# 安装依赖
cd site
npm install    # 自动链接 raw/ 目录

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

`postinstall` 脚本会自动创建 `site/raw` 到 `../raw` 的链接，你只需在根目录 `raw/` 中维护文件。

### 跨平台支持

链接脚本支持跨平台：
- **Linux/macOS**: 创建符号链接
- **Windows**: 创建 junction 链接（权限不足时自动复制目录）

## 工作流程

### 1. 添加原始内容

将 Markdown 文件放入 `raw/`：

```
raw/
├── my-article.md
├── my-notes.md
└── assets/
    └── image.png
```

### 2. LLM 处理

使用 LLM Agent（如 Claude Code、Cursor 等）处理内容：

1. 阅读源文件
2. 在 `site/wiki/notes/` 创建摘要页
3. 更新相关概念/主题页面
4. 添加交叉引用
5. 更新日志

### 3. 浏览

启动开发服务器，浏览你的知识库：

```bash
npm run dev
# 打开 http://localhost:5173
```

## 核心操作

| 操作 | 说明 |
|------|------|
| **Ingest** | 将源文档放入 `raw/`，LLM 读取、生成摘要、更新 Wiki 页面、添加交叉引用 |
| **Query** | 提问，LLM 检索 Wiki 并回答，有价值的回答可沉淀为新页面 |
| **Lint** | 定期检查：断链、缺失引用、矛盾信息、过时内容 |

## 与传统 RAG 的区别

| 特性 | 传统 RAG | LLM Wiki |
|------|----------|----------|
| 知识存储 | 原始文档分块 | 结构化 Wiki 页面 |
| 查询方式 | 每次重新检索推导 | 知识预编译，持续累积 |
| 交叉引用 | 无 | 自动建立关联 |
| 维护成本 | 需手动整理 | LLM 自动维护 |

## 技术栈

- [VitePress](https://vitepress.dev/) - 静态网站生成器
- Markdown - 所有内容都是纯 Markdown 文件
- Git - 版本控制和历史记录

## 关键文件

| 文件 | 用途 |
|------|------|
| `llm-wiki.md` | 原始设计文档 |
| `site/CODEBUDDY.md` | LLM 工作流指令 |
| `site/.vitepress/config.mts` | VitePress 主配置 |
| `site/.vitepress/sidebar.ts` | 侧边栏导航配置 |

## 许可证

[MIT](LICENSE)

## 致谢

灵感来源于使用 LLM 构建个人知识库的想法。详见 `llm-wiki.md` 了解设计哲学。
