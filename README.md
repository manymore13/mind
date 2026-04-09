# LLM Wiki

A personal knowledge base built with VitePress, designed for LLM-maintained knowledge management.

[简体中文](README_zh.md)

## The Idea

Instead of just retrieving from raw documents at query time (like traditional RAG), the LLM **incrementally builds and maintains a persistent wiki**. When you add a new source, the LLM reads it, extracts key information, and integrates it into the existing wiki — updating entity pages, revising topic summaries, and maintaining cross-references.

The wiki is a **persistent, compounding artifact**. Knowledge is compiled once and kept current, not re-derived on every query.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Raw Sources (raw/)                                     │
│  Immutable source documents - your curated collection   │
└─────────────────────────────────────────────────────────┘
                           ↓ LLM reads and processes
┌─────────────────────────────────────────────────────────┐
│  Knowledge Wiki (site/wiki/)                            │
│  LLM-maintained structured pages                        │
│  Summaries, concepts, topics, cross-references          │
└─────────────────────────────────────────────────────────┘
                           ↓ VitePress builds
┌─────────────────────────────────────────────────────────┐
│  Static Site                                            │
│  Browse your knowledge base as a website                │
└─────────────────────────────────────────────────────────┘
```

## Directory Structure

```
github_blog/
├── README.md           # This file
├── LICENSE             # MIT License
├── llm-wiki.md         # Design document
│
├── raw/                # Raw sources (you maintain)
│   ├── index.md
│   ├── *.md            # Original articles/notes
│   └── assets/         # Images and other assets
│
└── site/               # Website source
    ├── .vitepress/     # VitePress configuration
    ├── wiki/           # Knowledge base (LLM maintained)
    │   ├── concepts/   # Definition pages
    │   ├── topics/     # Topic exploration pages
    │   └── notes/      # Reading notes and summaries
    ├── blog/           # Blog posts
    ├── projects/       # Project showcases
    ├── scripts/        # Build scripts
    └── package.json
```

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/llm-wiki.git
cd llm-wiki

# Install dependencies
cd site
npm install    # Automatically links raw/ directory

# Start development server
npm run dev

# Build for production
npm run build
```

The `postinstall` script automatically creates a symlink from `site/raw` to `../raw`, so you only need to maintain files in the root `raw/` directory.

### Cross-Platform Support

The linking script works across platforms:
- **Linux/macOS**: Creates symbolic link
- **Windows**: Creates junction link (or copies if permission denied)

## Workflow

### 1. Add Sources

Place your markdown files in `raw/`:

```
raw/
├── my-article.md
├── my-notes.md
└── assets/
    └── image.png
```

### 2. LLM Processing

With an LLM agent (like Claude Code, Cursor, etc.), ask it to process the source:

1. Read the source file
2. Create a summary page in `site/wiki/notes/`
3. Update related concept/topic pages
4. Add cross-references
5. Update the log

### 3. Browse

Start the dev server and browse your knowledge base:

```bash
npm run dev
# Open http://localhost:5173
```

## Tech Stack

- [VitePress](https://vitepress.dev/) - Static site generator
- Markdown - All content is plain markdown files
- Git - Version control and history

## Key Files

| File | Purpose |
|------|---------|
| `llm-wiki.md` | Original design document |
| `site/CODEBUDDY.md` | LLM workflow instructions |
| `site/.vitepress/config.mts` | VitePress configuration |
| `site/.vitepress/sidebar.ts` | Sidebar navigation |

## License

[MIT](LICENSE)

## Credits

Inspired by the idea of building personal knowledge bases with LLM assistance. See `llm-wiki.md` for the original design philosophy.
