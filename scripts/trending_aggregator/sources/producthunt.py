"""Product Hunt 首页：抓今日新品。

PH 前端是 Next.js，数据在 __NEXT_DATA__ 里；selector 备用方案。
"""
import re
import json
import logging
from typing import List
from bs4 import BeautifulSoup
from ..types import TrendingItem, now_iso
from ..http_client import get

log = logging.getLogger("trending.ph")

URL = "https://www.producthunt.com/"


def fetch(session, user_agent, timeout, max_retries, backoff_base) -> List[TrendingItem]:
    resp = get(URL, session, user_agent, timeout, max_retries, backoff_base)
    soup = BeautifulSoup(resp.text, "html.parser")

    items: List[TrendingItem] = []

    # 方案 A：__NEXT_DATA__
    script = soup.find("script", id="__NEXT_DATA__")
    if script and script.string:
        try:
            data = json.loads(script.string)
            # PH 结构会变，递归找 nodes 里有 name+tagline+votesCount 的对象
            posts = []
            _walk_for_posts(data, posts)
            posts = [p for p in posts if p.get("name") and p.get("votesCount") is not None]
            posts.sort(key=lambda x: -(x.get("votesCount") or 0))
            seen_ids = set()
            rank = 0
            for p in posts:
                pid = p.get("id") or p.get("slug")
                if pid in seen_ids:
                    continue
                seen_ids.add(pid)
                rank += 1
                slug = p.get("slug") or ""
                name = p.get("name", "").strip()
                tagline = (p.get("tagline") or "").strip()
                topic = f"{name} — {tagline}" if tagline else name
                items.append(TrendingItem(
                    topic=topic,
                    source="producthunt",
                    rank=rank,
                    url=f"https://www.producthunt.com/posts/{slug}" if slug else URL,
                    lang="en",
                    fetched_at=now_iso(),
                    heat=p.get("votesCount"),
                    extra={"name": name, "tagline": tagline},
                ))
                if rank >= 20:
                    break
            if items:
                return items
        except Exception as e:
            log.warning("PH NEXT_DATA 解析失败，降级 HTML: %s", e)

    # 方案 B：selector
    for idx, a in enumerate(soup.select("a[href^='/posts/']")[:20], start=1):
        name = a.get_text(" ", strip=True)
        if not name or len(name) < 2:
            continue
        items.append(TrendingItem(
            topic=name,
            source="producthunt",
            rank=idx,
            url=f"https://www.producthunt.com{a.get('href', '')}",
            lang="en",
            fetched_at=now_iso(),
        ))
    return items


def _walk_for_posts(node, out, depth=0):
    """递归遍历 PH 的 GraphQL 嵌套结构，找出形如 product/post 的对象。"""
    if depth > 12:
        return
    if isinstance(node, dict):
        if "name" in node and "tagline" in node and "votesCount" in node:
            out.append(node)
        for v in node.values():
            _walk_for_posts(v, out, depth + 1)
    elif isinstance(node, list):
        for v in node:
            _walk_for_posts(v, out, depth + 1)
