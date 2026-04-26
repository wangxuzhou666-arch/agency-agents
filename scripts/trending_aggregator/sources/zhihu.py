"""知乎热榜镜像：readep.com/zhihu

镜像格式不稳，多 fallback selector。
"""
import re
import logging
from typing import List
from bs4 import BeautifulSoup
from ..types import TrendingItem, now_iso
from ..http_client import get

log = logging.getLogger("trending.zhihu")

URL = "https://readep.com/zhihu"


def fetch(session, user_agent, timeout, max_retries, backoff_base) -> List[TrendingItem]:
    resp = get(URL, session, user_agent, timeout, max_retries, backoff_base)
    soup = BeautifulSoup(resp.text, "html.parser")

    items: List[TrendingItem] = []
    # 主 selector：所有 a 链接（镜像用纯文字列表）
    candidates = soup.select("a")
    seen = set()
    rank = 0
    # 知乎条目格式："2026-04-26 标题 6442.0w+" 之类，先剥日期前缀和热度后缀
    DATE_PREFIX = re.compile(r"^\d{4}-\d{2}-\d{2}\s*")
    HEAT_SUFFIX = re.compile(r"\s*\d+(?:\.\d+)?\s*[wW万]\+?\s*$")
    for a in candidates:
        text = a.get_text(" ", strip=True)
        text = DATE_PREFIX.sub("", text)
        text = HEAT_SUFFIX.sub("", text)
        text = re.sub(r"^\d+[\.、:：\s]+", "", text).strip()
        # 知乎热榜标题特征：长度 6~80 中文字符
        if not (6 <= len(text) <= 80):
            continue
        # 过滤导航/页脚
        if any(x in text for x in ("登录", "注册", "首页", "About", "返回", "下一页")):
            continue
        href = a.get("href", "")
        if "zhihu.com" not in href and "readep.com/zhihu/" not in href:
            continue
        if text in seen:
            continue
        seen.add(text)
        rank += 1
        items.append(TrendingItem(
            topic=text,
            source="zhihu",
            rank=rank,
            url=href if href.startswith("http") else f"https://readep.com{href}",
            lang="zh",
            fetched_at=now_iso(),
        ))
        if rank >= 20:
            break
    return items
