# Newsletter / Builder Feed 订阅清单

**v1.0 — 2026-05-06**

Money Finder Mid Mode v1.1 后，**入口让位给被动 newsletter mining**。这个文件是入口路径的真相源。

---

## Why 入口换 newsletter

3 视角讨论（2026-05-06）共振结论：
- **Reality Checker**：连续 5 战 GO=0，自建 mining 是修工具不修核心病因
- **Trend Researcher**：awesome-idea-mining list 不存在 = 市场缺口本身（讽刺）
- **Software Architect**：3 次 Mid 0 次靠 PRIMARY 用户原话救下结论 → F5 退役

AI 时代真实 ROI：**Pieter Levels 不自建 mining 工具，他订阅 + 直觉 + ship**。Colar 应该把"我自己做最好的 idea miner"这个执念退役，让 newsletter + builder feed 做入口，Money Finder 6 agent 简化版只做"这一条 idea 真该 build 吗"的末端验证。

---

## 订阅清单（优先级排序）

### Tier 1 — 必订（每周 ≥1 次浏览）

| Newsletter | 链接 | 频率 | 信号类型 |
|---|---|---|---|
| **IndieHackers Weekly** | https://www.indiehackers.com/newsletters | 每周 | solo founder milestones / pain points / build-in-public |
| **Hacker News (Algolia 月度 top)** | https://hn.algolia.com/?dateRange=last_month&sort=byPopularity&type=story | 每月 | 工程师社群 demand signal / Show HN / Ask HN |
| **a16z newsletter** | https://a16z.com/news-content/ | 每周 | VC 视角的 secular trend / 大厂 ship 风险预警 |

### Tier 2 — 选订（每月 ≥1 次浏览）

| 来源 | 链接 | 频率 | 信号类型 |
|---|---|---|---|
| **The Hustle** | https://thehustle.co/ | 每日 | DTC / 小生意 case studies |
| **Stratechery (Ben Thompson)** | https://stratechery.com/ | 每周 | 平台战略 / Aggregation Theory |
| **Lenny's Newsletter** | https://www.lennysnewsletter.com/ | 每周 | 产品经理向，growth / retention 案例 |
| **Not Boring (Packy McCormick)** | https://www.notboring.co/ | 每周 | 跨领域趋势 + macro |

### Tier 3 — 可选（季度浏览）

| 来源 | 链接 | 频率 | 信号类型 |
|---|---|---|---|
| **YC Startup Library** | https://www.ycombinator.com/library | 不定 | 经典 founder 文章 |
| **First Round Review** | https://review.firstround.com/ | 不定 | 早期阶段方法论 |
| **Andrew Chen Newsletter** | https://andrewchen.com/ | 每周 | growth / network effects |

---

## Builder Feed（关注实时 build-in-public）

| Builder | 平台 | 关注理由 |
|---|---|---|
| **Pieter Levels (@levelsio)** | X / nomadlist | solo SaaS 极简主义 / $X MRR 公开 |
| **Marc Lou (@marc_louvion)** | X / shipfa.st | 快速 ship 模板 / starter kit |
| **Daniel Vassallo (@dvassallo)** | X / smallbets community | 多 small bets 组合策略 |
| **Tony Dinh (@tdinh_me)** | X | DevUtils / TypingMind 多产品 |
| **Anne-Laure Le Cunff (@anthilemoon)** | X / Ness Labs | 个人 SaaS / metalearning |

**自选 2 个**（按 Colar 当下方向调整，可选 AI/SaaS/F-1 友好方向）：
- _待 Colar 自定_（如关注 quant/Python builder：@matt_dancho）
- _待 Colar 自定_（如关注 build-in-public 中文圈：bento-style 知乎/即刻账号）

---

## Anthropic UA 友好的"主动需求表达"平台（替代 Reddit）

工具栈受限下，以下平台 Anthropic UA 可达（实测 200）：

| 平台 | URL / API | 信号密度 | Anthropic UA 测试 |
|---|---|---|---|
| **Hacker News (Algolia API)** | https://hn.algolia.com/api | 极高（Ask HN / Show HN） | 200 ✅ 免 token JSON |
| **GitHub Issues**（high-DAU SaaS） | https://api.github.com/repos/{owner}/{repo}/issues?labels=enhancement | 极高（feature request label = purest demand） | 200 ✅ 需 GH token |
| **IndieHackers** | https://www.indiehackers.com/forum | 高（milestones / forum） | 200 ✅ HTML 抓取 |
| **V2EX** | https://v2ex.com/api | 中（"创意"/"分享创造"节点） | 200 ✅ 官方 API |
| **ProductHunt GraphQL** | https://api.producthunt.com/v2/api/graphql | 中（评论区 + maker comments） | 200 ✅ 需 OAuth |
| **DEV.to / Lobsters / Stack Overflow** | 各官方 | 中低 | 200 ✅ |

---

## 30 天 dogfood 计划（2026-05-06 → 2026-06-05）

### Week 1（5/6-5/12）
- [ ] 订阅 Tier 1 的 3 个 newsletter
- [ ] 关注 Builder Feed 5 个核心账号
- [ ] 选 2 个自选 builder 加入

### Week 2-3（5/13-5/26）
- [ ] 每天 5min 浏览收件箱
- [ ] 标记任何"直觉强烈"的 idea 到 idea-pool.md 文件（保密模式）
- [ ] 0 主动 mining

### Week 4（5/27-6/5）
- [ ] 收件箱标记 idea 总数 ≥10？
  - YES → 跑 1 次 6 agent 简化版 Mid 验证（Step 0 闸门通过）
  - NO → 接受"这个月没值得做的 idea"，继续 newsletter 路径

### Reality Check 节点（2026-06-05）
**反 yes-man 自检**：
- 如果 30 天 newsletter 路径也跑出 GO=0，问题不是 mining 入口，是 **Colar 当下不在"找 idea"阶段**（应聚焦 P0 ByteDance 实习 + AI cheatsheet + 小红书 save:like 85% 工具号）
- 把 Money Finder 整体推到 2027 spring 毕业后再考虑

---

## 维护规则

- 每季度 review 一次清单（删除停更 newsletter / 补充新 builder）
- newsletter 失效（停更 ≥6 周）→ 移到 Archive section
- 不要无限扩张订阅清单（Tier 1 ≤5 个，Tier 2 ≤8 个，Builder ≤10 个）
- **不订阅以下类型**：纯营销 SEO 博客 / AI 副业卖课 / prompt 工程师培训 / 知识付费搬运（命中即拒）
