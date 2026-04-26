"""HTTP 工具：统一 UA、timeout、指数退避重试。

所有 source 必须通过 get() 而不是直接 requests.get，方便统一注入限速/缓存/代理。
"""
import time
import logging
import requests
from typing import Optional, Dict

log = logging.getLogger("trending.http")


def get(
    url: str,
    session: requests.Session,
    user_agent: str,
    timeout: int = 15,
    max_retries: int = 3,
    backoff_base: float = 1.5,
    extra_headers: Optional[Dict[str, str]] = None,
    fail_fast_on: tuple = (403, 404, 401),
) -> requests.Response:
    """带重试的 GET。失败抛 requests.RequestException，由调用方捕获。

    fail_fast_on 列出的状态码立即放弃（不重试），用于已知反爬 / 不存在等场景，
    避免浪费 3 次退避。
    """
    headers = {
        "User-Agent": user_agent,
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Accept": "text/html,application/json,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }
    if extra_headers:
        headers.update(extra_headers)

    last_exc: Optional[Exception] = None
    for attempt in range(1, max_retries + 1):
        try:
            resp = session.get(url, headers=headers, timeout=timeout, allow_redirects=True)
            if resp.status_code in fail_fast_on:
                # 直接抛，不重试
                raise requests.HTTPError(f"HTTP {resp.status_code} (fail-fast, no retry)", response=resp)
            if resp.status_code >= 500 or resp.status_code == 429:
                raise requests.HTTPError(f"HTTP {resp.status_code}", response=resp)
            resp.raise_for_status()
            # 强制 utf-8（中文站点经常 charset 错配）
            if resp.encoding is None or resp.encoding.lower() in ("iso-8859-1", "ascii"):
                resp.encoding = "utf-8"
            return resp
        except requests.RequestException as e:
            last_exc = e
            # fail-fast：不重试
            resp_obj = getattr(e, "response", None)
            if resp_obj is not None and resp_obj.status_code in fail_fast_on:
                log.error("GET %s 立即放弃（HTTP %s）", url, resp_obj.status_code)
                break
            if attempt < max_retries:
                sleep_s = backoff_base ** attempt
                log.warning("GET %s 失败（第 %d 次）: %s，%ss 后重试", url, attempt, e, round(sleep_s, 2))
                time.sleep(sleep_s)
            else:
                log.error("GET %s 最终失败: %s", url, e)
    assert last_exc is not None
    raise last_exc
