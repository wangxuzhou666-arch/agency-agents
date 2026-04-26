"""跨平台聚合器：去重 + 加权评分 + 跨平台加成。

去重策略（简单但够用，避免引入额外依赖）：
1. 标准化文本（小写 / 去标点 / 去常见停用前缀）
2. 用 SequenceMatcher（标准库 difflib）算相似度
3. 相似度 >= threshold 即视为同一话题，合并到第一个出现的 cluster
"""
from __future__ import annotations
import re
import logging
from difflib import SequenceMatcher
from typing import List, Dict, Tuple
from .types import TrendingItem

log = logging.getLogger("trending.aggregator")

# 去掉这些前后缀有助于跨平台匹配（如百度爱用引号 / 微博爱加 # ）
NOISE_PATTERN = re.compile(r'[#"""''「」（）()【】\[\]\.。，,!?！？:：;；\s\-—_~]+')


def _normalize(s: str) -> str:
    s = s.lower()
    s = NOISE_PATTERN.sub("", s)
    return s


def _bigrams(s: str) -> set:
    """中文/混合文本的 2-gram 集合，对短话题语义重叠更鲁棒。"""
    return {s[i:i+2] for i in range(len(s) - 1)} if len(s) >= 2 else {s}


def _jaccard(a: str, b: str) -> float:
    A, B = _bigrams(a), _bigrams(b)
    if not A or not B:
        return 0.0
    return len(A & B) / len(A | B)


def _similar(a: str, b: str) -> float:
    """综合：SequenceMatcher 比顺序，Jaccard 比关键词重叠，取较大值。"""
    if not a or not b:
        return 0.0
    # 短串包含关系直接判同
    if len(a) <= len(b) and a in b and len(a) >= 4:
        return 1.0
    if len(b) <= len(a) and b in a and len(b) >= 4:
        return 1.0
    seq = SequenceMatcher(None, a, b).ratio()
    jac = _jaccard(a, b)
    return max(seq, jac)


def _cluster_items(items: List[TrendingItem], threshold: float) -> List[List[TrendingItem]]:
    """贪心聚类：每个 item 归到第一个相似度过阈值的 cluster，否则自成一类。"""
    clusters: List[List[TrendingItem]] = []
    cluster_keys: List[str] = []  # 每个 cluster 的代表标准化串

    for item in items:
        norm = _normalize(item.topic)
        placed = False
        for idx, key in enumerate(cluster_keys):
            if _similar(norm, key) >= threshold:
                clusters[idx].append(item)
                placed = True
                break
        if not placed:
            clusters.append([item])
            cluster_keys.append(norm)
    return clusters


def aggregate(
    items: List[TrendingItem],
    source_weights: Dict[str, float],
    cross_bonus: float = 1.5,
    fuzzy_threshold: float = 0.65,
    top_n: int = 20,
) -> List[Dict]:
    """返回 top N 聚合结果。每个元素包含 score / topic / sources / items。"""
    clusters = _cluster_items(items, fuzzy_threshold)
    log.info("聚类：%d items -> %d clusters", len(items), len(clusters))

    scored: List[Dict] = []
    for cluster in clusters:
        score = 0.0
        platforms = set()
        for it in cluster:
            w = source_weights.get(it.source, 0.5)
            # rank 1 -> 50, rank 50 -> 1；rank 越靠前贡献越大
            rank_score = max(51 - it.rank, 1)
            score += w * rank_score
            platforms.add(it.source)
        if len(platforms) >= 2:
            score *= cross_bonus

        # 代表 topic 选 rank 最小（最热）的那个，更直观
        rep = min(cluster, key=lambda x: x.rank)
        scored.append({
            "topic": rep.topic,
            "score": round(score, 2),
            "platforms": sorted(platforms),
            "platform_count": len(platforms),
            "best_rank": rep.rank,
            "best_source": rep.source,
            "url": rep.url,
            "lang": rep.lang,
            "items": [it.to_dict() for it in cluster],
        })

    scored.sort(key=lambda x: (-x["score"], x["best_rank"]))
    return scored[:top_n]
