#!/usr/bin/env python3
"""
内容归档脚本 - process_url.py
支持：公众号、YouTube、抖音、B站、通用网页
用法：python scripts/process_url.py <URL>
"""

import sys
import os
import re
import json
import glob
import subprocess
import urllib.request
import urllib.parse
from datetime import datetime
from pathlib import Path


# ─────────────────────────────────────────────
# 1. 平台识别
# ─────────────────────────────────────────────

def detect_platform(url: str) -> str:
    if "youtube.com" in url or "youtu.be" in url:
        return "youtube"
    elif "mp.weixin.qq.com" in url or "weixin.qq.com" in url:
        return "wechat"
    elif "douyin.com" in url or "iesdouyin.com" in url:
        return "douyin"
    elif "bilibili.com" in url or "b23.tv" in url:
        return "bilibili"
    elif "v.qq.com" in url or "channels.weixin.qq.com" in url:
        return "shipinhao"
    else:
        return "article"


PLATFORM_LABELS = {
    "wechat":    "微信公众号",
    "youtube":   "YouTube",
    "douyin":    "抖音",
    "bilibili":  "哔哩哔哩",
    "shipinhao": "微信视频号",
    "article":   "网页文章",
}


# ─────────────────────────────────────────────
# 2. 内容抓取
# ─────────────────────────────────────────────

def fetch_via_jina(url: str) -> str | None:
    """用 Jina Reader 把网页转成 Markdown（免费，无需 API Key）"""
    jina_url = f"https://r.jina.ai/{url}"
    req = urllib.request.Request(
        jina_url,
        headers={
            "Accept": "text/markdown",
            "User-Agent": "Mozilla/5.0 (compatible; ArchiveBot/1.0)",
            "X-Return-Format": "markdown",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            content = resp.read().decode("utf-8")
            print(f"  ✅ Jina Reader 抓取成功，长度 {len(content)} 字符")
            return content
    except Exception as e:
        print(f"  ❌ Jina Reader 失败: {e}")
        return None


def fetch_youtube(url: str) -> tuple[str, str | None]:
    """抓取 YouTube：优先字幕，无字幕时提示"""
    print("  📺 处理 YouTube 视频...")

    # 先获取视频标题
    try:
        r = subprocess.run(
            ["yt-dlp", "--print", "title", "--no-playlist", url],
            capture_output=True, text=True, timeout=30
        )
        title = r.stdout.strip() or "YouTube Video"
    except Exception:
        title = "YouTube Video"

    print(f"  标题: {title}")

    # 尝试下载字幕（中文优先，回退英文，最后自动生成字幕）
    subtitle_path = f"/tmp/yt_{abs(hash(url))}"
    try:
        subprocess.run([
            "yt-dlp",
            "--write-subs", "--write-auto-subs",
            "--sub-lang", "zh-Hans,zh-Hant,zh,en",
            "--skip-download",
            "--convert-subs", "srt",
            "-o", subtitle_path,
            "--no-playlist",
            url,
        ], capture_output=True, timeout=60)
    except Exception as e:
        print(f"  ⚠️ 字幕下载出错: {e}")

    # 查找字幕文件
    subs = glob.glob(f"{subtitle_path}*.srt") + glob.glob(f"{subtitle_path}*.vtt")
    if subs:
        content = parse_subtitle_file(subs[0])
        print(f"  ✅ 字幕解析成功，共 {len(content)} 字符")
        return title, f"## 视频字幕\n\n{content}"
    else:
        print("  ⚠️ 未找到字幕，返回视频信息")
        # 尝试用 Jina 抓取 YouTube 页面描述
        page_content = fetch_via_jina(url)
        return title, page_content or "（该视频无字幕，请手动添加转录内容）"


def fetch_video_generic(url: str, platform: str) -> tuple[str, str | None]:
    """抖音/B站/视频号：尝试 yt-dlp + Jina 双路并行"""
    print(f"  🎬 处理 {PLATFORM_LABELS.get(platform, '视频')}...")

    title = "视频"
    try:
        r = subprocess.run(
            ["yt-dlp", "--print", "title", "--no-playlist", url],
            capture_output=True, text=True, timeout=30
        )
        title = r.stdout.strip() or title
    except Exception:
        pass

    print(f"  标题: {title}")

    # 尝试字幕
    subtitle_path = f"/tmp/vid_{abs(hash(url))}"
    try:
        subprocess.run([
            "yt-dlp", "--write-subs", "--write-auto-subs",
            "--sub-lang", "zh-Hans,zh,en",
            "--skip-download", "--convert-subs", "srt",
            "-o", subtitle_path, "--no-playlist", url,
        ], capture_output=True, timeout=60)
    except Exception:
        pass

    subs = glob.glob(f"{subtitle_path}*.srt") + glob.glob(f"{subtitle_path}*.vtt")
    if subs:
        content = parse_subtitle_file(subs[0])
        return title, f"## 视频转录\n\n{content}"

    # 回退到 Jina
    content = fetch_via_jina(url)
    return title, content or "（无法自动提取内容，请手动添加）"


# ─────────────────────────────────────────────
# 3. 字幕解析
# ─────────────────────────────────────────────

def parse_subtitle_file(filepath: str) -> str:
    """把 SRT/VTT 字幕文件转成干净的纯文本"""
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        raw = f.read()

    # 去掉 WEBVTT 头
    raw = re.sub(r"WEBVTT.*?\n\n", "", raw, flags=re.DOTALL)
    # 去掉时间戳行
    raw = re.sub(r"\d{2}:\d{2}:\d{2}[.,]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[.,]\d{3}[^\n]*", "", raw)
    # 去掉序号行
    raw = re.sub(r"^\d+\s*$", "", raw, flags=re.MULTILINE)
    # 去掉 HTML 标签
    raw = re.sub(r"<[^>]+>", "", raw)
    # 去掉定位标记
    raw = re.sub(r"\{[^}]+\}", "", raw)

    # 整理行，去重相邻重复
    lines = [l.strip() for l in raw.splitlines() if l.strip()]
    deduped = []
    for line in lines:
        if not deduped or line != deduped[-1]:
            deduped.append(line)

    # 每 5 句合并一段，方便阅读
    paragraphs = []
    for i in range(0, len(deduped), 5):
        paragraphs.append("".join(deduped[i : i + 5]))

    return "\n\n".join(paragraphs)


# ─────────────────────────────────────────────
# 4. AI 摘要（可选，需要 ANTHROPIC_API_KEY）
# ─────────────────────────────────────────────

def generate_ai_summary(content: str, api_key: str) -> tuple[str, list[str]]:
    """调用 Claude API 生成摘要和标签"""
    if not api_key or len(content.strip()) < 200:
        return "", []

    prompt = f"""请阅读以下内容，完成两件事：
1. 用 2-3 句话总结核心要点（中文）
2. 给出 3-5 个分类标签（中文，逗号分隔）

严格按以下格式输出，不要有其他内容：
摘要：[摘要内容]
标签：[标签1,标签2,标签3]

内容：
{content[:3000]}"""

    data = json.dumps({
        "model": "claude-haiku-4-5-20251001",
        "max_tokens": 400,
        "messages": [{"role": "user", "content": prompt}],
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=data,
        headers={
            "Content-Type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read())
            text = result["content"][0]["text"]

        summary, tags = "", []
        for line in text.splitlines():
            if line.startswith("摘要："):
                summary = line[3:].strip()
            elif line.startswith("标签："):
                tags = [t.strip() for t in line[3:].split(",") if t.strip()]

        print(f"  ✅ AI 摘要生成成功")
        return summary, tags
    except Exception as e:
        print(f"  ⚠️ AI 摘要失败（不影响归档）: {e}")
        return "", []


# ─────────────────────────────────────────────
# 5. 标题提取
# ─────────────────────────────────────────────

def extract_title_from_markdown(content: str) -> str:
    """从 Markdown 内容里提取第一个标题"""
    for line in content.splitlines():
        line = line.strip()
        if line.startswith("# "):
            return line[2:].strip()
        if line.startswith("## "):
            return line[3:].strip()
        if line and not line.startswith("---") and not line.startswith("http") and len(line) > 5:
            return line[:80]
    return "未命名"


def slugify(text: str) -> str:
    """生成文件名安全的 slug"""
    # 保留中文、字母、数字、连字符
    text = re.sub(r"[^\w\u4e00-\u9fff\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text.strip())
    return text[:60].strip("-") or "untitled"


# ─────────────────────────────────────────────
# 6. 保存 Markdown
# ─────────────────────────────────────────────

def save_markdown(
    title: str,
    content: str,
    url: str,
    platform: str,
    summary: str = "",
    tags: list[str] | None = None,
) -> Path:
    now = datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    year = now.strftime("%Y")
    month = now.strftime("%m")
    slug = slugify(title)
    filename = f"{date_str}-{slug}.md"

    output_dir = Path(f"content/{year}/{month}")
    output_dir.mkdir(parents=True, exist_ok=True)
    filepath = output_dir / filename

    tags_str = ", ".join(tags) if tags else ""

    frontmatter = f"""---
title: "{title.replace('"', "'")}"
date: {date_str}
platform: {platform}
source: {PLATFORM_LABELS.get(platform, "网页")}
url: "{url}"
tags: [{tags_str}]
summary: "{summary.replace('"', "'")}"
---

"""

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(frontmatter + content)

    print(f"  📄 已保存: {filepath}")
    return filepath


# ─────────────────────────────────────────────
# 7. 主流程
# ─────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        print("用法: python scripts/process_url.py <URL>")
        sys.exit(1)

    url = sys.argv[1].strip().rstrip("/")
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")

    print(f"\n{'='*50}")
    print(f"🔗 URL: {url}")

    platform = detect_platform(url)
    print(f"📌 平台: {PLATFORM_LABELS.get(platform, platform)}")
    print(f"{'='*50}")

    # 根据平台抓取内容
    title = ""
    content = ""

    if platform == "youtube":
        title, content = fetch_youtube(url)

    elif platform in ("douyin", "bilibili", "shipinhao"):
        title, content = fetch_video_generic(url, platform)

    else:
        # 公众号、网页文章 → Jina Reader
        content = fetch_via_jina(url)
        if content:
            title = extract_title_from_markdown(content)

    if not content:
        print("❌ 无法获取内容，请检查 URL 是否有效")
        sys.exit(1)

    if not title:
        title = "未命名内容"

    print(f"  📝 标题: {title}")

    # 可选：AI 摘要
    summary, tags = generate_ai_summary(content, api_key)

    # 保存
    filepath = save_markdown(title, content, url, platform, summary, tags)

    print(f"\n✅ 归档完成！→ {filepath}")


if __name__ == "__main__":
    main()
