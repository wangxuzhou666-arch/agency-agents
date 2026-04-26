"""并发执行所有 source，单源失败不影响其他。"""
import logging
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed, TimeoutError as FuturesTimeout
from typing import List, Dict, Tuple, Callable
from .types import TrendingItem
from .sources import SOURCE_REGISTRY

log = logging.getLogger("trending.runner")


def run_sources(
    enabled_sources: Dict[str, dict],
    user_agent: str,
    per_source_timeout: int,
    total_timeout: int,
    max_retries: int,
    backoff_base: float,
    only: List[str] = None,
) -> Tuple[List[TrendingItem], Dict[str, dict]]:
    """并发跑所有启用的 source。

    返回：(所有 items 平铺, per-source 状态字典)
    每个 source 的状态：{"status": "ok"/"error", "count": int, "error": str}
    """
    targets = {}
    for key, cfg in enabled_sources.items():
        if not cfg.get("enabled", True):
            continue
        if only and key not in only:
            continue
        if key not in SOURCE_REGISTRY:
            log.warning("config 里有 source=%s 但 registry 没注册，跳过", key)
            continue
        targets[key] = SOURCE_REGISTRY[key]

    log.info("即将抓取 %d 个源: %s", len(targets), list(targets.keys()))

    all_items: List[TrendingItem] = []
    status: Dict[str, dict] = {}
    session = requests.Session()

    with ThreadPoolExecutor(max_workers=min(len(targets), 10)) as pool:
        future_to_key = {
            pool.submit(_safe_call, key, fn, session, user_agent,
                        per_source_timeout, max_retries, backoff_base): key
            for key, fn in targets.items()
        }
        try:
            for fut in as_completed(future_to_key, timeout=total_timeout):
                key = future_to_key[fut]
                try:
                    items, err = fut.result()
                    if err:
                        status[key] = {"status": "error", "count": 0, "error": err}
                        log.error("[%s] 失败: %s", key, err)
                    else:
                        status[key] = {"status": "ok", "count": len(items), "error": None}
                        all_items.extend(items)
                        log.info("[%s] OK 抓到 %d 条", key, len(items))
                except Exception as e:
                    status[key] = {"status": "error", "count": 0, "error": f"future error: {e}"}
                    log.exception("[%s] future 异常", key)
        except FuturesTimeout:
            # 整体超时：把还没回来的标 timeout
            for fut, key in future_to_key.items():
                if key not in status:
                    fut.cancel()
                    status[key] = {"status": "error", "count": 0, "error": f"global timeout {total_timeout}s"}
                    log.error("[%s] 全局超时", key)

    return all_items, status


def _safe_call(
    key: str,
    fn: Callable,
    session: requests.Session,
    user_agent: str,
    timeout: int,
    max_retries: int,
    backoff_base: float,
) -> Tuple[List[TrendingItem], str]:
    """包一层 try/except，把任何异常转成 (空列表, error string)，绝不让单源 crash 拖垮整体。"""
    try:
        items = fn(session=session, user_agent=user_agent, timeout=timeout,
                   max_retries=max_retries, backoff_base=backoff_base)
        if not isinstance(items, list):
            return [], f"source returned {type(items).__name__}, not list"
        return items, ""
    except Exception as e:
        return [], f"{type(e).__name__}: {e}"
