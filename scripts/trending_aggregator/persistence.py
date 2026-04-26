"""快照持久化 + diff。

每次跑生成 snapshots/YYYY-MM-DDTHH-MM/ 目录。
latest.md 是当前最新结果（直接覆盖，不用软链以免 Windows 不支持）。
"""
import json
import logging
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Tuple, Optional
from .types import TrendingItem

log = logging.getLogger("trending.persist")


def make_snapshot_dir(base: Path, ts: Optional[datetime] = None) -> Path:
    ts = ts or datetime.now()
    name = ts.strftime("%Y-%m-%dT%H-%M")
    p = base / name
    p.mkdir(parents=True, exist_ok=True)
    return p


def save_raw(snapshot_dir: Path, source_key: str, items: List[TrendingItem]):
    """每个源的原始抓取结果存为 raw_<source>.json。"""
    f = snapshot_dir / f"raw_{source_key}.json"
    with f.open("w", encoding="utf-8") as fp:
        json.dump([it.to_dict() for it in items], fp, ensure_ascii=False, indent=2)


def save_status(snapshot_dir: Path, status: Dict[str, dict], elapsed_s: float):
    """运行日志：每个源的状态 + 总耗时。"""
    f = snapshot_dir / "run_log.json"
    payload = {
        "elapsed_seconds": round(elapsed_s, 2),
        "timestamp": datetime.now().isoformat(),
        "sources": status,
    }
    with f.open("w", encoding="utf-8") as fp:
        json.dump(payload, fp, ensure_ascii=False, indent=2)

    txt = snapshot_dir / "run_log.txt"
    lines = [f"Run finished in {round(elapsed_s, 2)}s @ {datetime.now().isoformat()}", "", "Per-source status:"]
    for k, v in status.items():
        lines.append(f"  [{v['status']:5}] {k:24} count={v['count']:3}  err={v.get('error') or ''}")
    txt.write_text("\n".join(lines), encoding="utf-8")


def save_aggregated_md(
    snapshot_dir: Path,
    aggregated: List[Dict],
    status: Dict[str, dict],
    elapsed_s: float,
    base_dir: Path,
    diff_info: Optional[Dict] = None,
) -> Path:
    """渲染 markdown，保存到 snapshot_dir/aggregated_top.md，并复制为 base/latest.md。"""
    lines = []
    lines.append(f"# 全网热点 Top {len(aggregated)}")
    lines.append(f"")
    lines.append(f"> 生成时间：{datetime.now().isoformat()}")
    lines.append(f"> 总耗时：{round(elapsed_s, 2)}s")
    lines.append(f"")

    # 数据源状态
    lines.append("## 数据源状态")
    lines.append("")
    lines.append("| Source | Status | Count | Error |")
    lines.append("|--------|--------|-------|-------|")
    for k, v in status.items():
        err = (v.get("error") or "")[:80].replace("|", "\\|")
        lines.append(f"| {k} | {v['status']} | {v['count']} | {err} |")
    lines.append("")

    # Top 列表
    lines.append("## 聚合榜单")
    lines.append("")
    lines.append("| # | 话题 | 评分 | 平台数 | 平台 | 跳转 | 变化 |")
    lines.append("|---|------|------|--------|------|------|------|")

    diff_info = diff_info or {}
    new_topics = set(diff_info.get("new", []))
    up_topics = set(diff_info.get("up", []))
    down_topics = set(diff_info.get("down", []))

    for idx, e in enumerate(aggregated, start=1):
        topic_disp = e["topic"].replace("|", "\\|")
        platforms = ",".join(e["platforms"])
        url = e["url"] or ""
        url_md = f"[link]({url})" if url else "-"
        marker = ""
        if e["topic"] in new_topics:
            marker = "🆕"
        elif e["topic"] in up_topics:
            marker = "⬆️"
        elif e["topic"] in down_topics:
            marker = "⬇️"
        lines.append(f"| {idx} | {topic_disp} | {e['score']} | {e['platform_count']} | {platforms} | {url_md} | {marker} |")

    lines.append("")

    # diff 摘要
    if diff_info:
        lines.append("## 与上一次快照对比")
        lines.append("")
        lines.append(f"- 🆕 新进榜：{len(diff_info.get('new', []))} 条")
        lines.append(f"- ⬆️ 排名上升：{len(diff_info.get('up', []))} 条")
        lines.append(f"- ⬇️ 排名下降：{len(diff_info.get('down', []))} 条")
        lines.append(f"- ⬛ 掉出榜单：{len(diff_info.get('dropped', []))} 条")
        lines.append("")
        if diff_info.get("dropped"):
            lines.append("**掉出榜单的话题**：")
            for t in diff_info["dropped"]:
                lines.append(f"- {t}")
            lines.append("")

    md = "\n".join(lines)
    out = snapshot_dir / "aggregated_top.md"
    out.write_text(md, encoding="utf-8")

    # 同时刷新 latest.md（直接覆盖，跨平台稳）
    latest = base_dir / "latest.md"
    latest.write_text(md, encoding="utf-8")
    return out


def save_aggregated_json(snapshot_dir: Path, aggregated: List[Dict]):
    f = snapshot_dir / "aggregated_top.json"
    with f.open("w", encoding="utf-8") as fp:
        json.dump(aggregated, fp, ensure_ascii=False, indent=2)


def find_previous_snapshot(base: Path, current_dir: Path) -> Optional[Path]:
    """找上一个快照目录（按目录名排序，排除当前）。"""
    if not base.exists():
        return None
    dirs = sorted(
        (p for p in base.iterdir() if p.is_dir() and p != current_dir and (p / "aggregated_top.json").exists()),
        key=lambda p: p.name,
    )
    return dirs[-1] if dirs else None


def compute_diff(prev_path: Path, current: List[Dict]) -> Dict:
    """对比当前 top 与上一次快照的 top，返回 new/up/down/dropped。"""
    if not prev_path:
        return {"new": [t["topic"] for t in current], "up": [], "down": [], "dropped": []}
    try:
        prev = json.loads((prev_path / "aggregated_top.json").read_text(encoding="utf-8"))
    except Exception as e:
        log.warning("读取上一次快照失败: %s", e)
        return {"new": [], "up": [], "down": [], "dropped": []}

    prev_rank = {t["topic"]: i for i, t in enumerate(prev, start=1)}
    cur_rank = {t["topic"]: i for i, t in enumerate(current, start=1)}

    new, up, down, dropped = [], [], [], []
    for topic, r in cur_rank.items():
        if topic not in prev_rank:
            new.append(topic)
        elif r < prev_rank[topic]:
            up.append(topic)
        elif r > prev_rank[topic]:
            down.append(topic)
    for topic in prev_rank:
        if topic not in cur_rank:
            dropped.append(topic)
    return {"new": new, "up": up, "down": down, "dropped": dropped}
