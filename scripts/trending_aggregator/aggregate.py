#!/usr/bin/env python3
"""CLI 入口。

Usage:
  python aggregate.py                    # 跑全部，输出 top 20
  python aggregate.py --source baidu,hackernews
  python aggregate.py --top 50
  python aggregate.py --diff             # 显示与上一次的差异（仅在控制台打印）
  python aggregate.py --no-snapshot      # 不写文件，仅打印
"""
import sys
import time
import logging
import argparse
from pathlib import Path
import yaml

# 支持以 module 或 script 方式运行
if __package__ is None or __package__ == "":
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    from trending_aggregator.runner import run_sources
    from trending_aggregator.aggregator import aggregate
    from trending_aggregator import persistence
else:
    from .runner import run_sources
    from .aggregator import aggregate
    from . import persistence

ROOT = Path(__file__).resolve().parent
CONFIG_PATH = ROOT / "config.yaml"
SNAPSHOT_BASE = ROOT / "snapshots"


def setup_logging(verbose: bool):
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)5s] %(name)s: %(message)s",
        datefmt="%H:%M:%S",
    )


def load_config():
    with CONFIG_PATH.open("r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def main():
    parser = argparse.ArgumentParser(description="全网热点话题聚合")
    parser.add_argument("--source", type=str, default=None,
                        help="逗号分隔，仅跑指定 source（如 baidu,hackernews）")
    parser.add_argument("--top", type=int, default=None, help="输出 top N")
    parser.add_argument("--diff", action="store_true", help="只显示与上次的 diff，不写新快照")
    parser.add_argument("--no-snapshot", action="store_true", help="不写文件")
    parser.add_argument("-v", "--verbose", action="store_true")
    args = parser.parse_args()

    setup_logging(args.verbose)
    log = logging.getLogger("trending.cli")

    cfg = load_config()
    g = cfg["globals"]
    only = [s.strip() for s in args.source.split(",")] if args.source else None
    top_n = args.top or g.get("output_top_n", 20)

    # diff-only 模式：直接读最新两个快照
    if args.diff:
        if not SNAPSHOT_BASE.exists():
            print("还没有任何快照，跑一次 aggregate.py 再来。")
            return
        snapshots = sorted([p for p in SNAPSHOT_BASE.iterdir() if p.is_dir()])
        if len(snapshots) < 2:
            print("快照不足 2 个，无法 diff。")
            return
        prev, curr = snapshots[-2], snapshots[-1]
        import json
        cur = json.loads((curr / "aggregated_top.json").read_text(encoding="utf-8"))
        d = persistence.compute_diff(prev, cur)
        print(f"\n=== {prev.name}  →  {curr.name} ===")
        print(f"🆕 新进 {len(d['new'])}: {d['new']}")
        print(f"⬆️  上升 {len(d['up'])}: {d['up']}")
        print(f"⬇️  下降 {len(d['down'])}: {d['down']}")
        print(f"⬛ 掉出 {len(d['dropped'])}: {d['dropped']}")
        return

    # 主流程：抓 → 聚合 → 持久化
    t0 = time.time()
    items, status = run_sources(
        enabled_sources=cfg["sources"],
        user_agent=g["user_agent"],
        per_source_timeout=g["per_source_timeout"],
        total_timeout=g["total_timeout"],
        max_retries=g["max_retries"],
        backoff_base=g["retry_backoff_base"],
        only=only,
    )
    log.info("抓取完成：%d items（耗时 %.2fs）", len(items), time.time() - t0)

    weights = {k: v.get("weight", 0.5) for k, v in cfg["sources"].items()}
    aggregated = aggregate(
        items,
        source_weights=weights,
        cross_bonus=g.get("cross_platform_bonus", 1.5),
        fuzzy_threshold=g.get("fuzzy_match_threshold", 0.65),
        top_n=top_n,
    )
    elapsed = time.time() - t0

    # 控制台打印（永远打印，方便交互式跑）
    print(f"\n=== 全网热点 Top {len(aggregated)} ===")
    for i, e in enumerate(aggregated, start=1):
        plats = ",".join(e["platforms"])
        print(f"{i:>2}. [{e['score']:>6.1f}] [{e['platform_count']}平台 {plats}] {e['topic']}")
    print(f"\n总耗时 {round(elapsed, 2)}s | items={len(items)} -> top {len(aggregated)}")

    if args.no_snapshot:
        return

    # 写快照
    snap = persistence.make_snapshot_dir(SNAPSHOT_BASE)
    by_source = {}
    for it in items:
        by_source.setdefault(it.source, []).append(it)
    for k, lst in by_source.items():
        persistence.save_raw(snap, k, lst)
    persistence.save_status(snap, status, elapsed)
    persistence.save_aggregated_json(snap, aggregated)

    # diff vs 上一次（要先写完 json 再找 prev）
    prev = persistence.find_previous_snapshot(SNAPSHOT_BASE, snap)
    diff = persistence.compute_diff(prev, aggregated) if prev else None
    persistence.save_aggregated_md(snap, aggregated, status, elapsed, ROOT, diff)
    log.info("快照已写入 %s", snap)


if __name__ == "__main__":
    main()
