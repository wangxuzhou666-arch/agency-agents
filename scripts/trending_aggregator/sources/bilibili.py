"""B 站热门：官方 JSON API，最稳。"""
import logging
from typing import List
from ..types import TrendingItem, now_iso
from ..http_client import get

log = logging.getLogger("trending.bilibili")

URL = "https://api.bilibili.com/x/web-interface/popular?ps=50&pn=1"


def fetch(session, user_agent, timeout, max_retries, backoff_base) -> List[TrendingItem]:
    resp = get(URL, session, user_agent, timeout, max_retries, backoff_base)
    data = resp.json()
    if data.get("code") != 0:
        raise RuntimeError(f"bilibili api code={data.get('code')} msg={data.get('message')}")

    items: List[TrendingItem] = []
    for idx, v in enumerate(data.get("data", {}).get("list", []), start=1):
        items.append(TrendingItem(
            topic=v.get("title", "").strip(),
            source="bilibili",
            rank=idx,
            url=v.get("short_link_v2") or f"https://www.bilibili.com/video/{v.get('bvid', '')}",
            lang="zh",
            fetched_at=now_iso(),
            heat=v.get("stat", {}).get("view"),
            extra={
                "up": v.get("owner", {}).get("name", ""),
                "tname": v.get("tname", ""),
                "like": v.get("stat", {}).get("like"),
            },
        ))
    return items
