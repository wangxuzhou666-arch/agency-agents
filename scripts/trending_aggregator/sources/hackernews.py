"""Hacker News 官方 firebase API：先拿 top story IDs，再批量取明细。

为减小请求量，只拉前 30 条。
"""
import logging
from typing import List
from ..types import TrendingItem, now_iso
from ..http_client import get

log = logging.getLogger("trending.hn")

TOP_URL = "https://hacker-news.firebaseio.com/v0/topstories.json"
ITEM_URL = "https://hacker-news.firebaseio.com/v0/item/{id}.json"


def fetch(session, user_agent, timeout, max_retries, backoff_base) -> List[TrendingItem]:
    resp = get(TOP_URL, session, user_agent, timeout, max_retries, backoff_base)
    ids = resp.json()[:30]

    items: List[TrendingItem] = []
    for rank, sid in enumerate(ids, start=1):
        try:
            r = get(ITEM_URL.format(id=sid), session, user_agent,
                    timeout=8, max_retries=2, backoff_base=backoff_base)
            d = r.json() or {}
        except Exception as e:
            log.warning("HN item %s 拉取失败，跳过: %s", sid, e)
            continue
        title = (d.get("title") or "").strip()
        if not title:
            continue
        items.append(TrendingItem(
            topic=title,
            source="hackernews",
            rank=rank,
            url=d.get("url") or f"https://news.ycombinator.com/item?id={sid}",
            lang="en",
            fetched_at=now_iso(),
            heat=d.get("score"),
            extra={"by": d.get("by", ""), "comments": d.get("descendants", 0)},
        ))
    return items
