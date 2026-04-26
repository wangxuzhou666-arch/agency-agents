"""Google Trends RSS：稳定可靠。

可扩展不同 geo（US/GB/JP/CN 等），目前只暴露 US。
"""
import re
import logging
from typing import List
from xml.etree import ElementTree as ET
from ..types import TrendingItem, now_iso
from ..http_client import get

log = logging.getLogger("trending.gtrends")

URL_TEMPLATE = "https://trends.google.com/trending/rss?geo={geo}"


def _fetch_geo(geo: str, source_key: str, session, user_agent, timeout, max_retries, backoff_base) -> List[TrendingItem]:
    url = URL_TEMPLATE.format(geo=geo)
    resp = get(url, session, user_agent, timeout, max_retries, backoff_base)
    # XML 解析（RSS 2.0）
    try:
        root = ET.fromstring(resp.content)
    except ET.ParseError as e:
        raise RuntimeError(f"google trends rss 解析失败: {e}")

    ns = {"ht": "https://trends.google.com/trending/rss"}
    items: List[TrendingItem] = []
    for idx, item in enumerate(root.findall(".//item")[:20], start=1):
        title_el = item.find("title")
        if title_el is None or not title_el.text:
            continue
        traffic = item.find("ht:approx_traffic", ns)
        heat = None
        if traffic is not None and traffic.text:
            m = re.search(r"(\d+)", traffic.text.replace(",", ""))
            if m:
                heat = int(m.group(1))
        link_el = item.find("link")
        items.append(TrendingItem(
            topic=title_el.text.strip(),
            source=source_key,
            rank=idx,
            url=(link_el.text or "").strip() if link_el is not None else "",
            lang="en",
            fetched_at=now_iso(),
            heat=heat,
            extra={"geo": geo},
        ))
    return items


def fetch_us(session, user_agent, timeout, max_retries, backoff_base):
    return _fetch_geo("US", "google_trends_us", session, user_agent, timeout, max_retries, backoff_base)


def fetch_gb(session, user_agent, timeout, max_retries, backoff_base):
    return _fetch_geo("GB", "google_trends_gb", session, user_agent, timeout, max_retries, backoff_base)


def fetch_jp(session, user_agent, timeout, max_retries, backoff_base):
    return _fetch_geo("JP", "google_trends_jp", session, user_agent, timeout, max_retries, backoff_base)
