# trending_aggregator

全网热点话题实时聚合脚本。10 个数据源，跨平台加权去重，输出 top N。

## 快速开始

```bash
cd scripts/trending_aggregator
pip install -r requirements.txt
python aggregate.py
```

输出：控制台打印 top 20 + 写快照到 `snapshots/YYYY-MM-DDTHH-MM/`。

## 数据源

| Source | 类型 | 中/英 | 权重 | 说明 |
|---|---|---|---|---|
| baidu | 官方页 | zh | 1.0 | 百度实时热搜 |
| bilibili | 官方 API | zh | 0.8 | B 站热门 |
| kaola_weibo | 聚合站 | zh | 0.95 | 微博 top 20 |
| kaola_douyin | 聚合站 | zh | 0.95 | 抖音 top 20 |
| kaola_toutiao | 聚合站 | zh | 0.7 | 头条 top 20 |
| zhihu | 镜像 | zh | 0.85 | 知乎 top 20 |
| hackernews | 官方 API | en | 0.9 | HN top 30 |
| producthunt | 公开页 | en | 0.75 | ⚠️ 当前 403，待修 |
| google_trends_us | RSS | en | 0.85 | Google Daily Trends US |
| x_trends_us | 第三方 | en | 0.8 | trends24.in US |

权重和启用状态都在 `config.yaml` 改，**不需要改代码**。

## CLI

```bash
python aggregate.py                    # 全跑，top 20
python aggregate.py --top 50           # top 50
python aggregate.py --source baidu,hackernews  # 只跑指定源
python aggregate.py --diff             # 只看与上次的差异
python aggregate.py --no-snapshot      # 不写文件
python aggregate.py -v                 # debug 日志
```

## 输出文件

每次跑生成 `snapshots/YYYY-MM-DDTHH-MM/`：

```
snapshots/2026-04-26T11-06/
├── raw_baidu.json          # 各源原始抓取（10 个文件）
├── raw_bilibili.json
├── ...
├── run_log.txt             # 人读日志
├── run_log.json            # 机读状态
├── aggregated_top.json     # 聚合 top N（机读）
└── aggregated_top.md       # 聚合 top N（人读，带 ⬆️⬇️🆕⬛ diff）
```

`latest.md` 始终指向最新一次的 `aggregated_top.md`。

## Robustness 保证

- **单源失败不影响全局**：每个 source 独立 try/except，失败标记 `error` 但不 crash
- **超时**：单源 15s、整体 60s（可改 config）
- **重试**：失败指数退避 3 次（1.5s → 2.25s → 3.4s）
- **HTML 结构变化**：用多个 selector fallback
- **首次跑无历史快照不报错**：diff 步骤会跳过
- **中文 utf-8 全程**：Windows / Mac / Linux 都不乱码

## 定时调度

### Windows 任务计划程序

```cmd
schtasks /create /tn "TrendingAggregator" /tr "python c:\Users\Colar\Desktop\agency-agents\scripts\trending_aggregator\aggregate.py" /sc hourly /mo 4
```

每 4 小时跑一次。

### Mac/Linux cron

```cron
0 */4 * * * cd /path/to/agency-agents/scripts/trending_aggregator && python aggregate.py >> cron.log 2>&1
```

### GitHub Actions（云端跑）

`.github/workflows/trending.yml`：

```yaml
name: Trending Aggregator
on:
  schedule: [{cron: '0 */4 * * *'}]
  workflow_dispatch:
jobs:
  aggregate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: {python-version: '3.11'}
      - run: pip install -r scripts/trending_aggregator/requirements.txt
      - run: python scripts/trending_aggregator/aggregate.py
      - uses: actions/upload-artifact@v4
        with:
          name: snapshot
          path: scripts/trending_aggregator/snapshots/
```

## 加新数据源（3 步）

1. 在 `sources/` 下新建 `mysite.py`，实现 `fetch(http) -> List[TrendingItem]`：

```python
from ..types import TrendingItem
from datetime import datetime, timezone

def fetch(http) -> list[TrendingItem]:
    resp = http.get("https://example.com/hot")
    items = []
    for rank, row in enumerate(resp.json()["data"], start=1):
        items.append(TrendingItem(
            topic=row["title"], source="mysite", rank=rank,
            heat=row.get("heat"), url=row.get("url", ""),
            fetched_at=datetime.now(timezone.utc).isoformat(),
            lang="zh",
        ))
    return items
```

2. 在 `sources/__init__.py` 注册：`"mysite": mysite.fetch`

3. 在 `config.yaml` 加配置：

```yaml
mysite:
  enabled: true
  weight: 0.7
  lang: zh
  description: "我的新源"
```

跑 `python aggregate.py --source mysite` 测试。

## 已知问题

- **producthunt** 当前返回 403：site 加了 anti-bot。修复方式：换用 `https://www.producthunt.com/feed?category=tech`（RSS）或挂代理。先在 config 里 `enabled: false` 跳过。
- **微博/抖音/头条** 只能拿 top 20（聚合站限制），要更多要付费 API（DataForSEO / 头条易官方）。
- **Reddit** 没接：Anthropic WebFetch 屏蔽 reddit.com，本地跑可加 `sources/reddit.py` 用 `requests` + UA header 直连 `https://www.reddit.com/r/popular.json`。

## 下一步增强方向

- [ ] 接 Reddit r/popular（本地直连）
- [ ] 接小红书第三方榜（千瓜 / 新红需登录，可考虑买 API）
- [ ] 加 Webhook：top 20 有变化时推 Slack / 微信 / Telegram
- [ ] 加历史趋势图：把 N 天快照串起来看话题生命周期
- [ ] 加情感/分类标签：用 LLM 给每条话题打 tag（突发/体育/AI/娱乐...）
