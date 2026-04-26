"""考拉新媒体导航 https://www.kaolamedia.com/hot

页面结构（已通过 dev 探测确认）：
  div.hot-block
    div.title    -> 板块名（"百度热点" / "微博热点" / "抖音热搜" / "头条热搜" 等）
    li / a       -> 各条话题（每榜 ~20 条）

策略：抓一次 HTML，三个 fetcher 共享缓存（线程锁 memoize）。
"""
import re
import time
import logging
from typing import List, Optional, Tuple
from threading import Lock
from bs4 import BeautifulSoup
from ..types import TrendingItem, now_iso
from ..http_client import get

log = logging.getLogger("trending.kaola")

URL = "https://www.kaolamedia.com/hot"

# 同一次 run 内三个 fetcher 共享一次 HTTP，避免重复请求
_cache: dict = {"html": None, "ts": 0.0}
_lock = Lock()
_CACHE_TTL = 300  # 5min


def _get_html(session, user_agent, timeout, max_retries, backoff_base) -> str:
    with _lock:
        now = time.time()
        if _cache["html"] and (now - _cache["ts"]) < _CACHE_TTL:
            return _cache["html"]
        resp = get(URL, session, user_agent, timeout, max_retries, backoff_base)
        _cache["html"] = resp.text
        _cache["ts"] = now
        return resp.text


def _find_block(soup: BeautifulSoup, keywords: Tuple[str, ...]):
    """在所有 div.hot-block 里找 title 命中关键词的那一个。"""
    for blk in soup.select("div.hot-block"):
        title_el = blk.select_one(".title")
        if not title_el:
            continue
        title_txt = title_el.get_text(strip=True)
        if any(kw in title_txt for kw in keywords):
            return blk
    return None


def _parse_block(block, source_key: str) -> List[TrendingItem]:
    if block is None:
        return []
    items: List[TrendingItem] = []
    li_els = block.select("li") or block.select("a")
    rank = 0
    for li in li_els:
        # 拿可点击的 a；没有就拿整个 li 的文字
        a = li.find("a") if li.name == "li" else li
        text = a.get_text(" ", strip=True) if a else li.get_text(" ", strip=True)
        # 干掉前面的"1." "01." "01、" 序号
        text = re.sub(r"^\d+[\.、:：\s]+", "", text).strip()
        # 抠尾巴的热度数字（"1163万" / "163.5w"）
        heat = None
        m = re.search(r"(\d+(?:\.\d+)?)\s*[万w]\s*$", text)
        if m:
            heat = int(float(m.group(1)) * 10000)
            text = re.sub(r"\s*\d+(?:\.\d+)?\s*[万w]\s*$", "", text).strip()
        if not text or len(text) < 2:
            continue
        # 兜底过滤：导航词
        if text in ("加入收藏", "首页", "返回", "更多"):
            continue
        rank += 1
        href = a.get("href", "") if a and a.name == "a" else ""
        if href and not href.startswith("http"):
            href = "https://www.kaolamedia.com" + href
        items.append(TrendingItem(
            topic=text,
            source=source_key,
            rank=rank,
            url=href or URL,
            lang="zh",
            fetched_at=now_iso(),
            heat=heat,
        ))
        if rank >= 20:
            break
    return items


def _fetch_section(keywords, source_key, session, user_agent, timeout, max_retries, backoff_base):
    html = _get_html(session, user_agent, timeout, max_retries, backoff_base)
    soup = BeautifulSoup(html, "html.parser")
    block = _find_block(soup, keywords)
    if block is None:
        log.warning("kaola 页面找不到板块 %s，可能改版了", keywords)
        return []
    return _parse_block(block, source_key)


def fetch_douyin(session, user_agent, timeout, max_retries, backoff_base):
    return _fetch_section(("抖音",), "kaola_douyin", session, user_agent, timeout, max_retries, backoff_base)


def fetch_weibo(session, user_agent, timeout, max_retries, backoff_base):
    return _fetch_section(("微博",), "kaola_weibo", session, user_agent, timeout, max_retries, backoff_base)


def fetch_toutiao(session, user_agent, timeout, max_retries, backoff_base):
    return _fetch_section(("头条", "今日头条"), "kaola_toutiao", session, user_agent, timeout, max_retries, backoff_base)
