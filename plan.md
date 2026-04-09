# 网站主题美化计划

## 设计方向：Mintlify 风格（阅读优化、简洁优雅）

参考 awesome-design-md 中的 Mintlify 设计理念：clean, green-accented, reading-optimized。

## 当前问题
- 使用 VitePress 默认主题，无自定义 CSS 变量覆盖
- 字体使用系统默认，缺少中文字体优化
- 无行高/字间距调整，阅读舒适度一般
- 主题色 `#3eaf7c` 偏暗，缺乏层次感

## 修改计划

### 1. 引入优质字体（Google Fonts）
- 标题字体：Inter（西文）+ 系统中文字体回退
- 正文字体：Inter（西文）+ 系统中文字体回退
- 代码字体：JetBrains Mono
- 通过 `config.mts` head 注入字体链接

### 2. 重写 `style.css` — 覆盖 VitePress CSS 变量
- **色彩体系**：Mintlify 风格绿色主色调，更鲜明的 accent 色
  - `--vp-c-brand-1`: `#10b981`（emerald-500）
  - `--vp-c-brand-2`: `#34d399`（emerald-400）
  - `--vp-c-brand-3`: `#059669`（emerald-600）
  - 浅色/深色模式完整适配
- **排版优化**：
  - 正文字号 16px，行高 1.8（中文阅读友好）
  - 标题字号梯度：h1=32px, h2=24px, h3=20px, h4=18px
  - 段落间距增大，留白更充分
  - 字间距微调，中文更舒适
- **布局调整**：
  - 内容区最大宽度适当放宽
  - 卡片圆角统一 12px
  - 更柔和的阴影和边框
- **代码块美化**：
  - 圆角 8px，柔和背景色
  - 代码字号 14px

### 3. 更新 `config.mts`
- 更新 `theme-color` meta 为新的 brand 色
- 添加字体 preconnect 链接

## 涉及文件
| 文件 | 修改内容 |
|------|---------|
| `site/.vitepress/theme/style.css` | 全面重写，覆盖 VitePress CSS 变量 |
| `site/.vitepress/config.mts` | head 中添加字体链接、更新 theme-color |

## 不修改
- 不改动 Layout.vue、组件、导航/侧边栏配置
- 不改动内容文件
- 保持现有 custom-block、link-to-related 等样式功能
