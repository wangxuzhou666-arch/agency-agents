"""统一 schema：所有 source 必须返回 List[TrendingItem]。

下游 agent 以这个 schema 为契约，schema 演进必须兼容（只加字段不删字段）。
"""
from dataclasses import dataclass, asdict, field
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any


@dataclass
class TrendingItem:
    topic: str               # 话题文本（必填）
    source: str              # 源 key，与 config 一致
    rank: int                # 该源内的排名（1 起）
    url: str                 # 跳转链接，没有就空串
    lang: str                # 'zh' / 'en'
    fetched_at: str          # ISO8601 UTC
    heat: Optional[int] = None     # 热度数值（点赞/播放/热度指数等），没有就 None
    extra: Dict[str, Any] = field(default_factory=dict)  # 平台特有字段（作者/分类等）

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
