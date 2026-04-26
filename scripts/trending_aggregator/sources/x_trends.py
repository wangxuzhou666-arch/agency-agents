"""trends24.in 抓 X / Twitter 各国趋势榜。"""
import re
import logging
from typing import List
from bs4 import BeautifulSoup
from ..types import TrendingItem, now_iso
from ..http_client import get

log = logging.getLogger("trending.xtrends")

URL_TEMPLATE = "https://trends24.in/{country}/"


def _fetch_country(country: str, source_key: str, session, user_agent, timeout, max_retries, backoff_base) -> List[TrendingItem]:
    url = URL_TEMPLATE.format(country=country)
    resp = get(url, session, user_agent, timeout, max_retries, backoff_base)
    soup = BeautifulSoup(resp.text, "html.parser")

    items: List[TrendingItem] = []
    # 主榜在第一个 .trend-card__list
    first_card = soup.select_one(".trend-card__list")
    if not first_card:
        # fallback：找所有 .list-container 里第一个
        first_card = soup.select_one(".list-container ol") or soup.select_one("ol")
    if not first_card:
        return items

    for idx, li in enumerate(first_card.select("li")[:20], start=1):
        a = li.find("a")
        if not a:
            continue
        title = a.get_text(strip=True)
        if not title:
            continue
        # tweet count 在 span.tweet-count 或 attribute
        heat = None
        cnt_el = li.select_one(".tweet-count")
        if cnt_el:
            m = re.search(r"([\d,]+)", cnt_el.get_text())
            if m:
                heat = int(m.group(1).replace(",", ""))
        items.append(TrendingItem(
            topic=title,
            source=source_key,
            rank=idx,
            url=a.get("href", ""),
            lang="en",
            fetched_at=now_iso(),
            heat=heat,
            extra={"country": country},
        ))
    return items


def fetch_us(session, user_agent, timeout, max_retries, backoff_base):
    return _fetch_country("united-states", "x_trends_us", session, user_agent, timeout, max_retries, backoff_base)
