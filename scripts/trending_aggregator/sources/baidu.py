"""百度实时热搜：HTML 内嵌 JSON 在 <script id="__NEXT_DATA__">，先尝试解析。

降级方案：如果 JSON 抽取失败，回退到 HTML selector 解析 .c-single-text-ellipsis。
"""
import re
import json
import logging
from typing import List
from bs4 import BeautifulSoup
from ..types import TrendingItem, now_iso
from ..http_client import get

log = logging.getLogger("trending.baidu")

URL = "https://top.baidu.com/board?tab=realtime"


def fetch(session, user_agent, timeout, max_retries, backoff_base) -> List[TrendingItem]:
    resp = get(URL, session, user_agent, timeout, max_retries, backoff_base)
    html = resp.text
    items: List[TrendingItem] = []

    # 优先：__NEXT_DATA__ 里的结构化数据
    soup = BeautifulSoup(html, "html.parser")
    script = soup.find("script", id="__NEXT_DATA__")
    if script and script.string:
        try:
            data = json.loads(script.string)
            cards = (data.get("props", {})
                         .get("pageProps", {})
                         .get("data", {})
                         .get("cards", []))
            rank = 0
            for card in cards:
                for it in card.get("content", []):
                    rank += 1
                    word = it.get("word") or it.get("query") or ""
                    if not word:
                        continue
                    heat = it.get("hotScore") or it.get("hot_score")
                    try:
                        heat = int(heat) if heat else None
                    except (TypeError, ValueError):
                        heat = None
                    url = it.get("url") or it.get("rawUrl") or ""
                    items.append(TrendingItem(
                        topic=word.strip(),
                        source="baidu",
                        rank=rank,
                        url=url,
                        lang="zh",
                        fetched_at=now_iso(),
                        heat=heat,
                        extra={"desc": (it.get("desc") or "")[:200]},
                    ))
            if items:
                return items[:50]
        except Exception as e:
            log.warning("百度 NEXT_DATA 解析失败，降级 HTML: %s", e)

    # 降级：直接抠 HTML
    cards = soup.select(".category-wrap_iQLoo")
    for idx, c in enumerate(cards, start=1):
        title_el = c.select_one(".c-single-text-ellipsis")
        if not title_el:
            continue
        items.append(TrendingItem(
            topic=title_el.get_text(strip=True),
            source="baidu",
            rank=idx,
            url=URL,
            lang="zh",
            fetched_at=now_iso(),
        ))
    return items[:50]
