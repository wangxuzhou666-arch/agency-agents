# Trending → Problem Discovery 模板

把全网热点 + 平台评论生态转化成"值得花几天～一周做需求验证"的 idea 候选清单。
**不是选选题，不是写笔记**—— 是 problem discovery + VC 五问门控。

---

## 🆕 2026-04-27 元 lesson（重大调整）

**trending top 20 是注意力市场，不是需求市场**。Manus / 总书记一周 / 五一文旅大礼包 这类话题是**算法推送 + 媒体编辑 + 政策导向**，不是用户主动表达的真实需求。
经过 26 agent 实战（17 max mode + 4 hard facts + 4 platform mining），**ROI 排序**：
**4 Platform Mining（M1-M4）> 4 Hard Facts（F1-F4）> 17 Agent Max Mode > 单纯 trending 抓取**

**原因**：M1-M4 直接挖**评论原话 / 搜索词反推 / 真 thread**——这些是用户主动行为，反映真实需求。trending 仅作辅助信号。
详见本文件末尾的"4 Platform Deep Mining"章节。

---

## 使用方法

**新默认**（2026-04-27 之后）：直接走 [4 Platform Deep Mining](#-4-platform-deep-mining推荐默认2026-04-27-后)，跳过 trending 抓取或仅做辅助。
**旧路径**（保留作 archive）：先跑 trending 抓取 → 选 Quick/Deep/Maximum。

1. 选触发档（Lite / Mid / Max — 见下表）
2. 把对应 section 的 prompt 复制到新窗口粘贴执行（或直接说触发词，Claude 自动调度）
3. 主对话做最终 synthesis

---

## 工作流架构（4 档强度，2026-04-27 后新增 Platform Mining）

| Mode | Agent 总数 | 时间 | 适用场景 |
|------|-----------|------|---------|
| **🆕 Platform Mining**（推荐默认）| 4 | 15-25min | 每周/双周拿真实需求信号 + idea pool |
| **Quick** | 3 | 30min | 每周巡检 trending（仅当不想直接跳过 trending）|
| **Deep** | 7 | 2-3h | 月度深度 + trending + Phase 0 信息收集 |
| **Maximum** | 17 | 4-6h | 季度战略复盘 / 重大方向决策（注意 sunk cost gate）|

```
Phase 0: Information Gathering  ← Deep / Maximum 才跑
   ↓ 抓评论原话 / 跨平台对齐 / 竞品调研 / 趋势纵深
Phase 1: Problem Discovery       ← 多视角并行讨论
   ↓ 趋势 / 痛点 / 决策 / 销售 / 文化 / PM 视角
Phase 2: 对抗 + 整合             ← 红队 → 现实检查 → 战略仲裁
   ↓ Top 3 候选 + 行动清单
Phase 3: 验证资产生成（可选）    ← 只在选定方向后跑
   ↓ 生成第一个验证笔记 / landing page / 用户访谈脚本
```

**原则：no passengers**。每个 agent 必须有独立、不可替代的视角，不堆数量凑热闹。

---

## 每次都要注入的硬约束（粘到 prompt 顶部）

```
我的身份：UPenn Systems Eng MS 在读，量化方向，AI agent 工具方向早期创业者。
当前优先级：毕业 + 实习 = P0；量化 + 小红书 = P2；AgentEval ⏸️ PAUSED。
已上线项目：AI cheatsheet（课件 PDF → 6 页 cheatsheet，2026-04-22 上线）。

硬约束（不可违反）：
1. VC 五问全绿才动手（市场 / 用户 / 护城河 / 可执行 / 真实需求）
2. "AI 协作产出不是 moat" —— 不做 AI wrapper
3. 创业 idea CONFIDENTIAL，不外泄
4. 默认中文，输出 compile 后格式（不要 LaTeX 源码）
5. 每条建议必须含具体验证动作（user interview / smoke test / landing page），
   不是泛泛"做调研"
```

---

## ✅ Quick Mode（30min，仅 Phase 1）

适用：常规每周巡检，热点榜没什么新东西的时候。
风险：数据薄，容易拍脑袋。建议至少跑过一次 Deep Mode 后再用 Quick。

并行调用三个 agent：

### Agent 1 — product-trend-researcher

```
从"信号 vs 噪音 + 痛点拆解"视角过 top 20（数据见 latest.md）。
每条用 mental model：事件 → 用户行为/情绪 → 痛点假设 → 现有解 → VC 五问 → 验证动作

输出：
- 20 条分 DROP / WATCH / DIG 三档
- DIG 类（≥3 条）每条做完整拆解：
  · 痛点假设（一句话，用户视角）
  · 现有方案 + 不足
  · VC 五问逐项打分（🟢🟡🔴）
  · ≥2 个本周可执行的验证动作（含红灯触发条件）
- 标记 AI wrapper 陷阱条目
- 给反对意见，不水
报告 ≤900 字。
```

### Agent 2 — marketing-xiaohongshu-specialist

```
视角：不是选笔记选题，是从"评论/搜索/私信行为"反推**真实未被满足的需求**。
哪些热点引发的评论区 / 私信问题暗示用户在主动找解决方案但没找到？

输出：
- 挑 3-5 条"暗藏需求信号"的话题
- 每条给：
  · 推测的用户原话型搜索词（"怎么判断 XX 是不是智商税"）
  · 用户画像（年龄/城市/决策场景）
  · 在小红书/抖音搜这条能验证什么假设
  · 一个低成本验证笔记（标题≤20字 + 钩子 + tag≤10），
    目标是看私信咨询率/评论求清单率，不是涨粉
- 区分"流量话题"和"需求话题"，前者 PASS
报告 ≤700 字。
```

### Agent 3 — nexus-strategy（用 general-purpose 跑）

```
先读 c:\Users\Colar\Desktop\agency-agents\.claude\agents\nexus-strategy.md 的
Phase 0 章节，应用方法论。

任务：作为最终战略仲裁者，整合前两个 agent 输出。

输出：
1. Top 3 候选方向排序（按"验证成本低 + 信号清晰 + 与现有项目协同"评分）
2. 识别 Agent 1 vs Agent 2 视角的冲突点 + 底层假设差异
3. 本周（7 天）行动清单：哪天做什么、多少时间、红灯触发条件
4. "诱人但应 PASS"清单 + VC 五问哪一问亮红灯
5. 反对意见：如果 top 20 里今天没有任何方向值得开新坑，直接说

不当 yes-man，敢说"全部砍掉"。
报告 ≤700 字。
```

---

## 🔬 Deep Mode（2-3h，含 Phase 0）

适用：月度深度审视，或某条热点直觉上感觉有戏要深挖。
工作流：先 Phase 0 收集数据 → 把数据传给 Phase 1 三 agent → Phase 2 整合。

### Phase 0 — Information Gathering（4 个并行 research agent）

```
任务前置：先用 trend-researcher 对 top 20 做粗筛，输出 5 条候选 DIG 话题。
然后对这 5 条话题，并行调用以下 4 个 research agent。
```

#### R1 — 评论原话挖掘（subagent: general-purpose）

```
对粗筛后的 5 条候选话题，每条做：
1. 用 WebSearch 搜 "{话题} 知乎" / "{话题} 微博讨论" / "{话题} 评论"
2. 用 WebFetch 抓返回的 top 3 知乎问题页 / 公开讨论页
3. 提取用户原话表达的痛点（不是事件描述，是"我...好烦/不知道/找不到..."这类语句）
4. 每条话题输出 5-10 句用户原话 + 标注情绪分类（困惑/愤怒/求助/吐槽）

注意：知乎/B站登录墙抓不到全文，用搜索结果摘要 + 公开页面够了。
不要伪造原话，抓不到就如实说"该话题评论数据不可访问"。
报告 ≤800 字。
```

#### R2 — 跨平台对齐（subagent: general-purpose）

```
对粗筛后的 5 条候选话题，验证海外是否有同主题需求信号：
1. WebSearch site:reddit.com "{话题英文翻译}"
2. WebSearch site:news.ycombinator.com "{话题英文翻译}"
3. WebSearch site:twitter.com OR site:x.com "{话题}"

每条话题输出：
- 海外是否有共鸣（YES/NO/PARTIAL）
- 引用 2-3 条具体讨论摘要 + 链接
- 跨平台信号强度评分（强/中/弱）

如果中文话题在海外完全无信号 → 标记"地域单点"，降低优先级。
报告 ≤600 字。
```

#### R3 — 竞品 / 现有解调研（subagent: general-purpose）

```
对粗筛后的 5 条候选话题，调研现有解决方案：
1. WebSearch "{痛点} site:producthunt.com"
2. WebSearch "{痛点} app" / "{痛点} 工具" / "{痛点} 服务"
3. 必要时 WebFetch 1-2 个相关产品的 landing page

每条话题输出：
- 现有玩家清单（≥3 个，含产品名 + 一句话定位）
- 用户对这些产品的吐槽（从评论/Reddit 抓）
- 市场是 红海 / 蓝海 / 半成品 三档判断
- 如果是 红海，明确说"该方向砍"

警惕：很多 idea 看起来"还没人做"是因为已经被做死过 N 次。
报告 ≤700 字。
```

#### R4 — 趋势纵深（subagent: general-purpose）

```
对粗筛后的 5 条候选话题，区分"事件"和"趋势"：
1. WebFetch trends.google.com 看 12 个月搜索曲线
2. WebSearch "{话题} 2024" / "{话题} 2025" 看历史讨论密度
3. 检查 latest.md 的 snapshots/ 目录里这条话题是首次出现还是常客

每条话题输出：
- 趋势类型：单点事件 / 周期性事件 / 长期趋势 / 加速趋势
- 12 个月搜索曲线形状（上升/下降/平稳/季节性）
- 如果是单点事件 → 强烈建议 DROP（一周后没人记得）

报告 ≤500 字。
```

### Phase 1 — Problem Discovery（带增强数据）

```
把 Phase 0 的 4 份报告 + latest.md 一起传给三个 agent。
prompt 同 Quick Mode，但增加一句：

"你拿到的不仅是 top 20 标题，还有 4 份信息收集报告（评论原话/跨平台/竞品/趋势）。
每条 DIG 类判断必须引用至少一份 Phase 0 报告里的具体证据，禁止纯靠假设推理。"
```

### Phase 2 — Synthesis

```
主对话基于 Phase 0 + Phase 1 全部产出，输出：
- 共识 vs 分歧对照表
- 今天/本周/本月三尺度行动清单
- 第一个具体动作（含验证渠道、目标样本量、红灯触发条件）
- 如果全部砍 → 直接说，不硬挑
```

---

## 🚀 Maximum Deep Mode（4-6h，17 agent 专家陪审团）

适用：季度战略复盘 / 重大方向决策 / 想要"集体智慧"对抗式讨论。
原则：每个 agent 独立视角，no passengers。token 不省，要的是判断质量。

### Phase 0 — Information Gathering（8 个并行 research agent）

**前置**：先用 product-trend-researcher 对 top 20 做粗筛，输出 5 条候选 DIG 话题。
然后对这 5 条话题，**并行调用以下 8 个 research agent**。

每个 prompt 顶部都要注入"硬约束清单"（见模板顶部）。

#### R1 — 知乎深挖（agent: marketing-zhihu-strategist）
```
对 5 条候选话题，每条做：
1. 用 WebSearch 找该话题在知乎的 top 5 高赞问题/回答
2. WebFetch 抓返回的问题页（即使部分被墙，搜索结果摘要也能用）
3. 知乎是中文长篇痛点最集中地，重点提取"我..." 开头的自述型痛点
   而非编辑型科普答案
4. 标注每条原话的"决策瓶颈类型"：信息缺失 / 选择困难 / 信任缺失 /
   时间成本 / 经济成本 / 情绪成本

注意：不要伪造原话，抓不到就如实说。token 充足，每条话题至少给 8 句原话。
报告 ≤900 字。
```

#### R2 — 抖音评论生态（agent: marketing-douyin-strategist）
```
对 5 条候选话题，每条做：
1. WebSearch 抖音相关视频 / 抖音搜索趋势
2. 提取评论区高频"痛点表达"（情绪化、口语化、低门槛人群视角）
3. 重点：抖音用户和知乎用户痛点表达差异 —— 同一话题，
   抖音可能暴露"沉默大多数"的真实需求

注意区分"段子梗"和"真实抱怨"，前者过滤掉。
报告 ≤700 字。
```

#### R3 — B 站 Z 世代视角（agent: marketing-bilibili-content-strategist）
```
对 5 条候选话题，每条做：
1. WebSearch 该话题在 B 站的相关视频 + 评论区
2. 重点抓 Z 世代（18-25 岁学生 / 应届）的痛点表达
3. 区分"二次元亚文化吐槽"和"真实生活痛点"

如果话题在 B 站无讨论 → 标记"非 Z 世代关注话题"。
报告 ≤500 字。
```

#### R4 — 微博 / X 实时舆论（agent: marketing-twitter-engager）
```
对 5 条候选话题，每条做：
1. WebSearch 微博 + X 的实时讨论
2. 抓"舆论风向反转点"——话题是否在过去 24h 出现立场翻转
3. 识别"愤怒驱动型痛点"（短期爆发但不可持续）vs
   "持续焦虑型痛点"（长期低强度但稳定）

报告 ≤500 字。
```

#### R5 — Reddit 跨文化对齐（agent: marketing-reddit-community-builder）
```
对 5 条候选话题，每条做：
1. 翻译话题为英文
2. WebSearch site:reddit.com 找相关讨论
3. 重点子版块：r/China / r/AskAnAmerican / r/LifeProTips /
   r/AmazingTechnology / r/AskReddit
4. 评估海外是否有同主题需求 + 海外用户的解决方式
5. 如果中文话题在海外完全无信号 → 标记"地域单点"

报告 ≤700 字。
```

#### R6 — 跨境消费 / 出海视角（agent: marketing-cross-border-ecommerce）
```
对 5 条候选话题，从"跨境消费 / 出海机会"视角评估：
1. 哪些话题反映中国产品/服务出海的需求空白
2. 哪些话题反映外国产品进入中国的机会
3. 留学生 / 海外华人这个特殊群体的痛点是否被照顾

注意：用户是 UPenn 留学生，跨境视角天然有 unfair advantage。
对话题做"有/无跨境杠杆"二分。
报告 ≤500 字。
```

#### R7 — 竞品 / Product Hunt 调研（agent: general-purpose）
```
对 5 条候选话题，调研现有解决方案：
1. WebSearch "{痛点} site:producthunt.com" / "{痛点} site:ycombinator.com"
2. 必要时 WebFetch top 3 竞品 landing page
3. WebSearch "{痛点} alternatives" / "{痛点} sucks" 找用户吐槽

每条话题输出：
- 现有玩家清单（≥5 个）
- 用户对现有产品的吐槽（具体引用，注明来源链接）
- 红海 / 蓝海 / 半成品 三档判断
- 死过的尸体清单（已下架 / 已 pivot 的产品 + 死因）

警惕："还没人做"通常等于"被做死过"。token 充足，挖深一点。
报告 ≤900 字。
```

#### R8 — 趋势纵深 / 量化（agent: general-purpose）
```
对 5 条候选话题，量化趋势：
1. WebFetch trends.google.com 看 12 个月搜索曲线（含中文 + 英文版本）
2. WebSearch "{话题} 2024" "{话题} 2025" 看历史讨论密度
3. 检查 latest.md 的 snapshots/ 目录里这条话题历史出现频率
4. 如果是新词，找语义近邻词的趋势（如"AI agent" 看"copilot" "autopilot"）

每条话题输出：
- 趋势类型：单点事件 / 周期性 / 长期上升 / 长期下降 / 加速
- 12 个月曲线形状描述
- 投资意义：值得现在动手 / 等等再说 / 已过窗口期
- 如果是单点事件 → 强烈建议 DROP

报告 ≤600 字。
```

### Phase 1 — Problem Discovery（6 个并行讨论 agent，专家陪审团）

把 Phase 0 的 8 份报告 + latest.md 一起传给以下 6 个 agent。
**每条判断必须引用至少 2 份 Phase 0 报告里的具体证据，禁止纯假设推理**。

#### D1 — 信号 vs 噪音（agent: product-trend-researcher）
```
视角：从市场结构 / 长期趋势 / 用户行为变化角度筛选。
不重复其他 agent 的工作 —— 你的核心问题是：
"这条话题反映的是事件还是趋势？信号强度足以支撑产品决策吗？"

输出：把 5 条候选按 信号 / 半信号 / 噪音 三档分类，
每条引用 Phase 0 证据 + 给出"如果是信号，3 年后会演变成什么"的预测。
报告 ≤800 字。
```

#### D2 — 痛点合成与 JTBD（agent: product-feedback-synthesizer）
```
视角：把 Phase 0 R1-R6 抓到的零散用户原话，合成成可执行的 Jobs-To-Be-Done。
不重复其他 agent —— 你专精"从评论噪音里提取信号 + 聚类成 job 描述"。

输出：每条候选话题给出：
- 3-5 个 JTBD 陈述（"When [情境]，I want to [行动]，so I can [结果]"）
- 每个 JTBD 的证据强度（强/中/弱），引用至少 2 句 Phase 0 原话
- JTBD 的 underserved 程度（现有方案是否覆盖）

注意：JTBD 是动作语句，不是抽象描述。
报告 ≤900 字。
```

#### D3 — 行为决策 / 后悔理论（agent: specialized-behavioral-decision-scientist）
```
视角：用行为经济学 / regret theory / automation bias 分析用户决策瓶颈。
不重复其他 agent —— 你的核心问题是：
"用户在这个决策点的认知负担、损失厌恶、信息不对称在哪？
什么样的产品能降低这些摩擦？"

输出：每条候选话题给出：
- 决策瓶颈类型（信息搜索 / 评估对比 / 决定 / 后悔规避）
- 用户的 anticipated regret 是什么
- 产品干预点（不是"做个 AI"，是具体的认知减负机制）

报告 ≤700 字。
```

#### D4 — 销售发现 / 付费意愿（agent: sales-discovery-coach）
```
视角：用 BANT / SPICED / Pain Qualifier 框架评估"用户愿不愿意付钱解决这个痛点"。
不重复其他 agent —— 你的核心问题是：
"痛点存在 ≠ 用户付钱解决。哪些痛点能转化成 willingness to pay？"

输出：每条候选话题给出：
- Pain severity（1-10）
- Pain frequency（每天/每周/每月/每年）
- Existing budget（用户当前为这个痛点花多少钱/时间）
- Buying trigger（什么事件驱动用户掏钱）
- 如果三项以上 < 中等强度 → 直接说"商业化机会差"

报告 ≤700 字。
```

#### D5 — 文化语境 / 跨文化盲点（agent: specialized-cultural-intelligence-strategist）
```
视角：识别用户（留学生 / 海外华人）和主流中文用户的需求差异。
不重复其他 agent —— 你的核心问题是：
"这个痛点是中文用户独有？海外华人独有？还是普世？
跨文化语境会让产品定位发生什么偏移？"

输出：每条候选话题给出：
- 文化敏感性评分（普世 / 中文圈 / 海外华人 / 单一地区）
- 跨文化盲点（如"对老外不疼但对中国用户疼"或反之）
- 用户作为留学生的 unfair advantage 在哪

报告 ≤500 字。
```

#### D6 — PM 视角 / Problem→MVP（agent: product-manager）
```
视角：从 problem 推导可落地的 MVP 形态 + 资源估算。
不重复其他 agent —— 你的核心问题是：
"如果这个 problem 真实，最小可验证产品长什么样？
1 个开发者周末能不能做出来？"

输出：每条候选话题给出：
- MVP 形态描述（具体到功能列表，不是"AI 助手"）
- 开发资源估算（人天 / 关键依赖）
- 第一批种子用户从哪来
- 杀掉这个 idea 的最便宜实验是什么

报告 ≤700 字。
```

### Phase 2 — 对抗 + 整合（3 个串行 agent）

**这一阶段是串行，不是并行**。每个 agent 接收前一个的输出。

#### A1 — 红队挑战（agent: testing-agent-red-team-specialist）
```
任务：对 D1-D6 的所有 idea，全力寻找致命漏洞。
你不是来肯定的，是来杀的。

对每条 D1-D6 提出的 idea，攻击：
- 痛点假设是否伪造（用户嘴上说要 vs 真的会买）
- 数据样本偏差（是否只代表少数高声量用户）
- 现有方案为什么"够用"，新产品凭什么 10x
- 用户为什么不会自己 DIY
- 启动阶段 cold start 怎么解
- 如果 OpenAI / 某大厂明天宣布做这个，idea 还活吗

输出：每条 idea 给"幸存度"评分（0-10），分数 ≤ 5 的标记 "RED FLAG"。
不当 yes-man，越凶越好。
报告 ≤900 字。
```

#### A2 — 现实检查 / VC 五问硬门控（agent: testing-reality-checker，全局 tier 1）
```
任务：对 A1 红队后幸存的 idea，做最终硬门控。
你的默认立场是 "NEEDS WORK" —— 要求压倒性证据才放行。

对每条幸存 idea，逐项打分：
1. 市场（具体数字 + 来源）
2. 用户（≥3 个具体用户访谈或证据，非泛指）
3. 护城河（72h 内能不能被复制？如果能 → 红灯）
4. 可执行（用户当前资源 + 主线项目冲突？）
5. 真实需求（≥5 句 Phase 0 原话证据 + ≥1 个付费意愿信号）

任何一项缺乏证据 → 标记 "INSUFFICIENT EVIDENCE"，
直接砍掉，不给"看起来很有潜力"的免死金牌。

输出：通过门控的 idea 清单（可能为 0 条，那就如实报）。
报告 ≤700 字。
```

#### A3 — 战略仲裁（subagent: general-purpose，扮演 NEXUS 角色）
```
先读 c:\Users\Colar\Desktop\agency-agents\.claude\agents\nexus-strategy.md
的 Phase 0 + Phase 1 章节。

任务：基于 A1（红队幸存度）+ A2（现实检查通过）的产出，做最终战略整合。

输出：
1. Top 3 候选方向（如果不足 3 条，如实给 1-2 条或 0 条）
2. 每条给出 1 周 / 1 月 / 3 月 时间尺度的具体行动清单
3. 第一个动作（含验证渠道、目标样本量、红灯触发条件）
4. 与用户主线（毕业 + 实习 + AI cheatsheet）的协同 / 冲突分析
5. 反对意见：如果今天 top 20 没有任何方向通过门控，明确说"全砍"

不为了交付硬挑。token 充足时反而更要克制 —— 选 1 条好的胜过 5 条平庸的。
报告 ≤800 字。
```

### Phase 3 — 验证资产生成（可选，仅在 A3 输出 ≥1 条后）

对 A3 选定的 Top 1 方向，并行调用：

- **marketing-xiaohongshu-specialist** — 出第一篇验证笔记草稿
- **marketing-content-creator** — 出 landing page 文案
- **sales-discovery-coach** — 出用户访谈脚本（≥7 个开放性问题）
- **engineering-rapid-prototyper** — 出 MVP 技术骨架（如果是工具类）

### 何时跑 Maximum Mode

- 季度战略复盘
- 想验证"AI cheatsheet 之外有没有第二条线"
- 出现一个直觉强烈的话题但拿不准
- 不要每周都跑 —— 频次 ≤ 1 次/月

---

## 🎯 一键粘贴启动包（Maximum Mode）

**用法**：直接复制下面整段（含三个反引号之间的内容）粘贴到新窗口。
主对话 agent 会自己读模板、按 Phase 0/1/2/3 顺序调度所有 17 个子 agent。

```
任务：从今天的全网热点 top 20 做 problem discovery，
跑 Maximum Deep Mode（17 agent 专家陪审团）。

工作前置：
1. 先读 c:\Users\Colar\Desktop\agency-agents\scripts\trending_aggregator\discovery_prompt_template.md
   全文，理解工作流架构、硬约束、各 Phase agent 列表与 prompt 模板。
2. 读 c:\Users\Colar\Desktop\agency-agents\scripts\trending_aggregator\latest.md
   拿最新热点数据。如果时间戳 > 6 小时，先跑
   `python scripts/trending_aggregator/aggregate.py` 拿最新数据再开始。

我的身份与硬约束：
- UPenn Systems Eng MS 在读，量化方向，AI agent 工具方向早期创业者
- 当前优先级：毕业 + 实习 = P0；量化 + 小红书 = P2；AgentEval ⏸️ PAUSED
- 已上线项目：AI cheatsheet（课件 PDF → 6 页 cheatsheet，2026-04-22 上线）
- VC 五问全绿才动手（市场 / 用户 / 护城河 / 可执行 / 真实需求）
- "AI 协作产出不是 moat" —— 不做 AI wrapper
- 创业 idea CONFIDENTIAL，不外泄
- 默认中文，输出 compile 后格式（不要 LaTeX 源码）
- 每条建议必须含具体验证动作，不是泛泛"做调研"

执行流程：

【Step 1 — 粗筛】
单独调用 product-trend-researcher，对 top 20 输出 5 条 DIG 候选话题。
如果它判断不足 5 条，按实际数量来（最少 3 条），不为了凑数硬塞。

【Step 2 — Phase 0 信息收集】
对粗筛后的候选话题，**并行**调用以下 8 个 research agent
（一个消息内 8 个 Agent tool calls，token 不省）：

  R1: marketing-zhihu-strategist
  R2: marketing-douyin-strategist
  R3: marketing-bilibili-content-strategist
  R4: marketing-twitter-engager
  R5: marketing-reddit-community-builder
  R6: marketing-cross-border-ecommerce
  R7: general-purpose（竞品 / Product Hunt 调研）
  R8: general-purpose（趋势纵深 / Google Trends）

每个 agent 的具体 prompt 用模板里 Phase 0 R1-R8 的对应段落，
注入硬约束 + 候选话题清单 + 上一步的粗筛理由。

【Step 3 — Phase 1 多视角讨论】
把 Phase 0 八份报告 + latest.md 一起传给以下 6 个 agent，**并行**调用：

  D1: product-trend-researcher
  D2: product-feedback-synthesizer
  D3: specialized-behavioral-decision-scientist
  D4: sales-discovery-coach
  D5: specialized-cultural-intelligence-strategist
  D6: product-manager

每个 prompt 必须强调"你不重复其他 agent 的工作，你的核心问题是 X"
（X 用模板对应段落里的描述），并要求每条判断引用 ≥2 份 Phase 0 证据。

【Step 4 — Phase 2 对抗筛选（串行）】

  A1: testing-agent-red-team-specialist —— 全力杀 idea，给幸存度评分
  A2: testing-reality-checker —— 默认 NEEDS WORK，VC 五问硬门控
  A3: general-purpose（扮演 NEXUS）—— 最终战略仲裁，输出 Top 3

A1 → A2 → A3 串行，后一个接收前一个产出。
A2 通过门控的可能为 0 条，那就如实报"今天 top 20 没有方向通过门控"，
不为了交付硬挑。

【Step 5 — 主对话最终 synthesis】
基于 A3 输出，给我：
- 共识 vs 分歧对照表（Phase 1 的 6 个 agent 在哪条话题上分歧最大）
- 今天 / 本周 / 本月三尺度行动清单
- 第一个具体动作（含验证渠道、目标样本量、红灯触发条件）
- 主线项目（毕业 + 实习 + AI cheatsheet）协同 / 冲突分析

【Step 6 — 写入历史记录】
任务结束后，更新模板末尾的"历史调用记录"表格，
填入今天日期、Maximum mode、DIG 候选数、最终 ACT 数、关键备注。

【Step 7 — Phase 3 验证资产（可选，问我决定）】
如果 A3 输出 ≥1 条 ACT，问我"是否启动 Phase 3 生成验证资产？"
我说 yes 才跑，调用：
  - marketing-xiaohongshu-specialist（验证笔记）
  - marketing-content-creator（landing page 文案）
  - sales-discovery-coach（用户访谈脚本）
  - engineering-rapid-prototyper（MVP 技术骨架，仅工具类 idea）

通用规则：
- 不当 yes-man，敢说"全部砍掉"
- 红队 + 现实检查阶段不要替 idea 找台阶下
- token 充足，单 agent 报告字数上限放到 800-900 字
- 全程中文输出
- 每个 Phase 完成后给我一个简短进度更新（≤3 行），不要等到最后才出结果

开始执行 Step 1。
```

**预期产出**：5-7 份 Phase 0 报告 + 6 份 Phase 1 报告 + 3 份 Phase 2 报告 + 主对话最终 synthesis。
**总耗时**：4-6 小时（取决于网络抓取速度）。

---

## 🎯 4 Platform Deep Mining（推荐默认，2026-04-27 后）

### 为什么是 4 Platform Mining

**26 agent 实战（17+4+4+1）后的元 lesson**：
- trending top 20 = 注意力市场（媒体推送 + 算法 + 政策导向），**新闻周期 < 7 天**
- M1-M4 平台真深挖 = 需求市场（用户主动搜索 + 评论原话 + 真 thread + 付费数据）
- ROI 实测：M1-M4 单次产出比 17 agent max mode 高 5×，时间 1/3，token 1/4

### 4 平台分工（不重复，no passengers）

| 序 | 平台 | subagent_type | 核心 mining 维度 | 真原话密度 |
|----|------|--------------|----------------|----------|
| **M1** | 小红书 | marketing-xiaohongshu-specialist | 搜索词反推 + 主号反推 + distribution 钩子（信号源 + 分发渠道一体）| 6/10（登录墙限制）|
| **M2** | 抖音 | marketing-douyin-strategist | 搜索建议词反推 + 视频标题层 + 评论生态供给侧 | 2/10（反爬严，主要靠搜索建议）|
| **M3** | B 站 | marketing-bilibili-content-strategist | UP 主真使用反馈 + 评论"小白困惑"模式 + Z 世代焦虑生态 | 5/10（cache snippet 可用）|
| **M4** | Reddit | marketing-reddit-community-builder | r/LocalLLaMA + r/AI_Agents 真 thread URL + GitHub Issue cross-validate | 8/10（真 thread URL + snippet）|

**真原话密度排序**（实战验证）：**Reddit (8) > 知乎 (8) > 小红书 (6) > B 站 (5) > 抖音 (2)**

### 触发档（Lite / Mid / Max）

| 档 | 触发词 | 说明 |
|----|-------|------|
| **Lite** | "跑下 4 平台真深挖" | 4 agent 并行，~15-20min，输出 idea pool + distribution 钩子 |
| **Mid** | "4 平台真深挖 + hard facts 核查" | 4 mining + **5 fact agent (F1-F5) 对齐 VC 五问**，~30-40min。**升级 2026-04-27**：F5 User/JTBD 新增（Q2 Market+Q5 Demand 已有 F1+F2，Q3 Moat 已有 F3，Q4 Executable 已有 F4，缺 Q2 User → 加 F5）|
| **Max** | "max mode 4 平台 + hard facts + 17 agent 全跑" | 完整 26 agent（仅季度复盘用）|

### 硬约束（每个 agent prompt 顶部都注入）

```
身份：UPenn Systems Eng MS / 量化方向 / AI agent 工具方向创业者
P0：毕业 + 实习；P2：量化 + 小红书
已上线：AI cheatsheet（2026-04-22）
硬约束：
1. VC 五问全绿才动手（市场/用户/护城河/可执行/真实需求）
2. 不做 AI wrapper
3. 创业 idea CONFIDENTIAL
4. 默认中文 + compile 后格式（不 LaTeX 源码）

mining 硬规则：
- **必须用 WebSearch + WebFetch 真访问** —— 拒绝模式推理
- **每条 finding 必须给真实 URL** —— 拒绝占位符
- **抓不到 → INSUFFICIENT EVIDENCE**，不补造
- **抓评论原话 / 搜索词，不抓新闻媒体转载**
```

### M1-M4 完整 prompt 模板见下

#### M1 小红书（最关键，信号 + distribution 一体）

```
M1 小红书 mining 任务。三线并挖：

A. 话题形态：选定的 idea 候选（如 trending top 或自定义）在小红书的真实分布
   - WebSearch `{话题} 小红书`、`{话题} 翻车 小红书`、`{话题} 测评 小红书`
   - 找真实笔记 URL + 评论区"求清单/求教程/求避坑"私信咨询模式

B. 主号反推（"Colar 在路上"P2 主战场）：
   - AI 工具品类高 RPM 笔记类型当前热度（避坑/横评/cheatsheet/一键工作流）
   - 现存"AI 工具理性测评"账号竞争（≥3 个具体账号 URL）
   - 复合人设稀缺性评分（留学生+量化+AI agent 创业者）
   - AI cheatsheet 种草路径（具体标题/钩子/tag ≤10）

C. 搜索词反推真实需求（小红书 ≥5 个搜索词）：
   每条给底层 job + "没找到什么" + 切入机会评分

输出：A 线 / B 线 / C 线 / 元结论（最强 distribution idea ≤3 条）/ INSUFFICIENT EVIDENCE 标注
报告 ≤900 字
```

#### M2 抖音（搜索建议反推 + 供给侧标题层）

```
M2 抖音 mining 任务。重点：搜索建议反推 + 标题层供给侧（评论反爬，不强求）

1. WebSearch `{话题} 抖音` / `{话题} 邀请码 抖音` / `{话题} 翻车 抖音`
   - 找真实视频 URL（douyin.com/video/... 或 douyin.com/shipin/...）
2. WebFetch 视频页（即使评论拿不到，标题/简介/计数器也有价值）
3. **关键**：搜索建议词反推（输入法智能补全反映用户主动表达）
4. AI 焦虑营销 vs 反焦虑信号 voice 强弱评分

输出：1.话题真实命中 / 2.供给侧主导词 / 3.AI 焦虑生态 / 4.搜索建议反推 / 元结论
特别要求：拒绝引用新闻媒体转载内容作为"抖音用户原话"
报告 ≤700 字
```

#### M3 B 站（UP 主真反馈 + 6 大小白困惑 + Z 世代焦虑）

```
M3 B 站 mining 任务。

1. WebSearch `{话题} bilibili` / `{话题} BV 实测` / `{话题} 教程 B 站`
   - 找真实 BV 号 + UP 主名（≥5 个）+ 播放/赞/币/藏数据
2. 评论区"小白困惑"模式（即使评论抓不到，CSDN/知乎转述可用）
3. Z 世代焦虑表达：焦虑制造方账号 vs 焦虑承受方高赞 vs 反焦虑 voice 评分
4. 用户复合人设（留学生+量化+AI agent 创业者）niche 在 B 站现存竞争

输出：1-4 + 元结论（idea #19 "AI 工具理性测评"B 站频道空间评分）+ INSUFFICIENT EVIDENCE
报告 ≤700 字
```

#### M4 Reddit（最高真原话密度）

```
M4 Reddit mining 任务。重点：r/LocalLLaMA + r/AI_Agents 真 thread URL

1. WebSearch `site:reddit.com r/LocalLLaMA {话题英文}`
2. WebSearch `site:reddit.com r/AI_Agents {话题}` / `r/singularity {话题}`
3. WebSearch `site:reddit.com r/ChatGPTCoding {开发者痛点}`
4. WebSearch GitHub Issue / feature request 作为 cross-validate

特别要求：
- **拒绝占位符 URL**（如 `1j6...` `1j7...`），所有引用必须完整 reddit.com URL
- WebFetch reddit.com 经常被拦，搜索引擎 snippet 比纯推理强
- GitHub Issue 是开发者主动 demand 的强信号

输出：1.r/LocalLLaMA 真 thread / 2.r/AI_Agents Manus / 3.开发者 demand request /
4.评测 SaaS 用户吐槽 / 元结论（留学生 unfair advantage 真实杠杆）
报告 ≤900 字
```

### 一键粘贴启动包（4 Platform Mining Lite）

```
任务：跑 4 Platform Deep Mining，给我 idea pool + distribution 钩子。

工作流：
1. 我可选先跑 `python -m scripts.trending_aggregator.aggregate` 拿 trending 作辅助信号（可跳过）
2. 并行启动 M1-M4（subagent 类型见 discovery_prompt_template.md）
3. 每个 agent 独立 mining 自己平台，强制真 web tools，禁止占位符 URL
4. 主对话整合 4 份报告 → 输出：
   - 真实 idea pool（从评论原话 / 搜索词 / 真 thread 反推，不依赖 trending）
   - 每条 idea 的 fact base 强度（≥2 条独立证据 = 硬）
   - distribution 钩子（M1 小红书具体钩子 + M3/M4 分发渠道）
   - 警告（被官方占坑 / 红海 / 学生路径不通的 idea）

硬约束清单（注入每个 agent prompt 顶部，见模板"硬约束"section）。

候选话题（自定义，可空）：
- 主题 1：____ 
- 主题 2：____
（如果空，agent 自行从 trending top 20 + 个人方向选 2-3 条）

期望输出：
- ≤30min wall time
- ≥5 条 idea，每条带 fact base 强度评分 + distribution 钩子
- 砍掉的 idea 明确说为什么砍（红海 / 已被占坑 / 学生进不去）

开始。
```

### 何时跑 Platform Mining

- **每周或双周一次**：拿最新 distribution 钩子 + idea pool
- **任何想拓展 P2 主号"Colar 在路上"内容线时**
- **任何想验证某条 idea 的真实需求时**

不要每周升级到 Hard Facts + Max Mode（feedback_max_mode_explicit_trigger 第 4 条 P0 红灯硬规则）。

---

## 🎯 Mid Mode（4 平台真深挖 + Hard Facts F1-F5，9 agent，2026-04-27 升级）

### 为什么是 Mid

Lite v2 给 idea pool + distribution 钩子（信号层），但**不验证关键 claim 是否真**。Max mode 26 agent 全跑（4-6h）多数情况是仪式化。Mid 是**信号 + 关键事实双层**：

- 4 mining (M1-M4) 输出 idea pool
- 5 hard facts (F1-F5) 对 idea pool 里**最关键 ≤3 条 claim** 做 web 真查，对齐 VC 五问

**何时升 Mid（不是何时跑 Lite）**：
- Lite 跑出 ≥1 条 idea 让你**直觉强烈但不敢动手**
- 准备投入 ≥1 周资源做付费验证之前
- Lite-X 解锚跑出 surprise score ≥7 的新赛道，要核查"是否真的没人做"
- **不要每周跑 Mid**（≤2 次/月，Hard Facts agent token 重）

### F1-F5 对齐 VC 五问（2026-04-27 升级）

| Fact agent | 对齐 VC 问 | 核心任务 | subagent_type |
|---|---|---|---|
| **F1** | Q1 Market 市场 | 市场规模 / 增长曲线 / 主要玩家收入数据真查 | general-purpose |
| **F2** | Q5 Demand 真实需求 | 付费意愿信号（charge 数据 / 续费率 / churn）真查 | general-purpose |
| **F3** | Q3 Moat 护城河 | 技术壁垒 / 数据壁垒 / 网络效应 72h 复刻测试 | testing-agent-red-team-specialist |
| **F4** | Q4 Executable 可执行 | 监管 / license / API 限制 / 学生身份壁垒真查 | general-purpose |
| **F5** | Q2 User / JTBD | 目标用户 ICP 真存在 + JTBD 强度（≥3 真用户原话） | product-feedback-synthesizer |

**F5 升级原因**（2026-04-27 commit 3dace4e）：原 4-fact 漏了 Q2 User/JTBD 这条，导致"市场存在 + 需求真 + 没壁垒 + 能执行"全绿但**目标用户画像虚浮**的 idea 蒙混过关。F5 强制每条 idea ≥3 句 Phase 0 / mining 报告里的真用户原话作 JTBD 证据，否则 INSUFFICIENT。

### 硬约束（每个 agent prompt 顶部都注入）

复用 4 Platform Mining 章节的硬约束 + 加 Hard Facts 专属规则：

```
Hard Facts 专属硬规则：
- 每条 fact claim 必须 ≥2 个独立 PRIMARY 源交叉验证
- 单源数字 → 标 [UNVERIFIED]，不进结论主表
- WebFetch 拿不到 → INSUFFICIENT EVIDENCE，不补造
- 拒绝引用训练数据当现状（>90 天数据必须重核）
- 命中 Lite v2 的 D1-D4（URL 三类源 / 可达性 / 时间戳 / 双源数字）+ N1-N4（敏感黑名单 / 流量噪声 / KILL list / 季节性）全套
```

### F1-F5 完整 prompt 模板

#### F1 — Market 市场真查（VC Q1）

```
F1 Market 真查任务。对 mining 报告里的 ≤3 条最值得做的 idea，每条做：

1. WebSearch + WebFetch 真查市场规模：
   - "{idea 关键词} market size 2026" / "{中文} 市场规模 2026"
   - 行业报告 PRIMARY 源（Gartner / IDC / 36 氪 / 艾瑞）
2. 主要玩家收入 / 用户量 / 增长曲线（≥2 个 PRIMARY 源交叉）
3. 12-24 个月增长趋势（trends.google.com + 行业报告对照）

输出（每条 idea）：
- 市场规模（带 URL 来源）
- 增长率 + 增长性质（爆发 / 稳定 / 衰退 / 加速衰减）
- 头部玩家 ≥3 个（含收入 / GMV / 用户量真数据）
- VC Q1 评分（🟢🟡🔴）+ 理由
- 拿不到数据 → INSUFFICIENT EVIDENCE 不补造

报告 ≤700 字。
```

#### F2 — Demand 付费意愿真查（VC Q5）

```
F2 Demand 真查任务。对 mining 报告里的 ≤3 条最值得做的 idea，每条做：

1. WebSearch 付费产品 charge 数据 / pricing page 真访问
2. 用户续费率 / churn / NPS（PRIMARY 源：产品官网 / Reddit 用户讨论 / G2 评论）
3. 主动付费搜索词强度（"{idea} pricing" "{idea} 多少钱" 搜索量）
4. 现存付费方案的吐槽点（"too expensive" / "not worth" / 评论区原话）

输出（每条 idea）：
- 现存付费方案 ≥3 个（含具体定价 + URL）
- 付费用户行为证据（≥3 句 Reddit / 评论原话）
- VC Q5 评分（🟢🟡🔴）+ 理由
- 主动付费意愿强 / 中 / 弱 + 理由
- 拿不到证据 → INSUFFICIENT EVIDENCE

报告 ≤700 字。
```

#### F3 — Moat 护城河 72h 复刻测试（VC Q3）

```
F3 Moat 红队任务。对 mining 报告里的 ≤3 条最值得做的 idea，每条做：

红队默认立场：**这 idea 72h 内能被一个 mid-level dev 复刻**，请你证伪我。

1. 技术壁垒：核心算法 / 模型 / 工程量是否公开（GitHub 搜 "{idea} open source"）
2. 数据壁垒：数据来源是否独占 / 是否能抓 / 是否需要授权
3. 网络效应：单边 vs 双边市场 / 临界用户量 / 飞轮成立条件
4. 品牌壁垒：是否需要先发 / 是否需要内容矩阵 / 是否需要 KOL
5. 监管壁垒：license / 牌照 / 资质要求

每条 idea 输出：
- 4 类壁垒逐项打分（无 / 弱 / 中 / 强）
- 复刻成本估算（人天 + 资金）
- 如果 OpenAI / 大厂 30 天内 ship 同款，idea 还活吗
- VC Q3 评分（🟢🟡🔴）+ 理由
- 任意一类是"无壁垒" → 直接红灯，不留情面

报告 ≤800 字。
```

#### F4 — Executable 可执行真查（VC Q4）

```
F4 Executable 真查任务。对 mining 报告里的 ≤3 条最值得做的 idea，每条做：

1. 监管约束：license / 资质 / 备案 / 审批要求（中美双查）
2. API / 平台限制：依赖的 API 是否有 ToS 限制 / 速率限制 / 数据使用限制
3. F-1 学生身份约束：CPT / OPT / 不能 self-employed 的红线
4. 资金 / 资源约束：MVP 起步成本（开发 + 服务器 + 数据 + 推广）
5. 主线冲突：与 P0（毕业 + 实习）+ P2（量化 + 小红书）+ AI cheatsheet 的时间冲突

每条 idea 输出：
- 5 类约束逐项打分（绿 / 黄 / 红）
- 留学生身份**红线 trigger**（任一 → 直接砍）
- 主线冲突评估（每周需投入小时数 vs 当前可支配时间）
- VC Q4 评分（🟢🟡🔴）+ 理由

报告 ≤700 字。
```

#### F5 — User / JTBD 真用户证据（VC Q2，2026-04-27 新增）

```
F5 User/JTBD 真查任务。对 mining 报告里的 ≤3 条最值得做的 idea，每条做：

核心问题：**目标用户画像是真的还是想象的？JTBD 是真痛点还是伪需求？**

1. 从 M1-M4 mining 报告抓出该 idea 相关的 ≥3 句真实用户原话
2. 如果 mining 报告原话不足 → 补 WebSearch 真访问（小红书评论 / Reddit thread / 知乎回答）
3. 把原话聚类成 JTBD 陈述（"When [情境]，I want to [行动]，so I can [结果]"）
4. 评估 ICP（Ideal Customer Profile）真实性：
   - 年龄 / 职业 / 城市 / 收入 / 决策场景具体化
   - 该 ICP 在哪个平台密度最高
   - 该 ICP 的当前替代方案 + 不满

每条 idea 输出：
- ICP 画像（≥5 个具体维度，带证据）
- ≥3 个 JTBD 陈述 + 每个 JTBD 引用 ≥2 句真用户原话（含 URL）
- JTBD underserved 程度（现有方案是否覆盖 / 哪个维度没覆盖）
- VC Q2 评分（🟢🟡🔴）+ 理由
- 真用户原话 < 3 句 → INSUFFICIENT EVIDENCE，直接砍

报告 ≤800 字。
```

### Mid Mode 执行流程

```
Step 1 — 主对话预搜（E3 优化）
   ↓ WebSearch batch 4 平台关键词，整理 80-line brief
Step 2 — Phase A：4 mining (M1-M4) 并行
   ↓ 输出 idea pool（≥5 条，带 fact base 强度）
Step 3 — 主对话筛选
   ↓ 从 idea pool 选 ≤3 条最值得做 hard facts 验证的 idea
   ↓ （选择标准：fact base 强度 ≥2 + 与主线协同 OR surprise score ≥7）
Step 4 — Phase B：5 hard facts (F1-F5) 并行
   ↓ 5 agent 同时对选定 ≤3 条 idea 做 VC 五问真查
Step 5 — 主对话最终 synthesis
   ↓ 输出：每条 idea 的 VC 五问颜色矩阵 + GO/NO-GO/PIVOT 判决
```

### 一键粘贴启动包（Mid Mode）

```
任务：跑 Money Finder Mid Mode（4 平台真深挖 + Hard Facts F1-F5 对齐 VC 五问）。

方向：[空 → agent 自行从 trending top 20 + 个人方向选 2-3 条 / 或自定义]

工作流：

【Step 1 — 主对话预搜（E3 编排优化）】
主对话先跑 1 轮 WebSearch batch（4 平台关键词，覆盖：xiaohongshu / douyin / bilibili / reddit），整理 snippet brief（≤80 行）注入 M1-M4。

【Step 2 — Phase A：4 mining 并行】
并行启动 M1-M4（一条消息内 4 个 Agent tool calls）：
  M1: marketing-xiaohongshu-specialist（小红书）
  M2: marketing-douyin-strategist（抖音）
  M3: marketing-bilibili-content-strategist（B 站）
  M4: marketing-reddit-community-builder（Reddit）

每个 agent 注入 4 Platform Mining 章节的硬约束 + Lite v2 Hardening D1-D4 + N1-N4 全套规则。
agent 输出严格 JSON schema（E2），WebFetch 必须带 prompt 参数（E1）。

【Step 3 — 主对话筛选】
主对话整合 4 份 JSON，按 signal_strength × seasonal_factor × url_tag 降权排序，
从 idea pool 选 ≤3 条最值得 hard facts 验证的 idea。

筛选标准（满足 ≥2 条）：
- fact base 强度 ≥2（≥2 个独立 PRIMARY 源）
- demand_type = REAL（不是 ATTENTION_ONLY）
- 不在 KILL list（N3）
- 不命中黑名单（N1）
- 与主线协同 OR surprise score ≥7

如果筛选后 < 1 条 → 直接报"今天 idea pool 没有值得 hard facts 验证的 idea"，**不为了交付硬挑**。

【Step 4 — Phase B：5 hard facts 并行】
对选定的 ≤3 条 idea，并行启动 F1-F5（一条消息内 5 个 Agent tool calls）：
  F1: general-purpose（市场真查，VC Q1）
  F2: general-purpose（付费意愿真查，VC Q5）
  F3: testing-agent-red-team-specialist（护城河红队，VC Q3）
  F4: general-purpose（可执行真查，VC Q4）
  F5: product-feedback-synthesizer（用户/JTBD 真查，VC Q2，2026-04-27 新增）

每个 agent 注入：
- 通用硬约束（身份 + P0/P2 优先级 + 不做 wrapper 等）
- Hard Facts 专属硬规则（≥2 PRIMARY 源 / 拒绝训练数据 / D1-D4 + N1-N4）
- F1-F5 对应 prompt 模板（见上方章节）

【Step 5 — 主对话最终 synthesis】
基于 4 份 mining + 5 份 fact 报告，输出：

1. **VC 五问颜色矩阵**（每条 idea 一行）：
   | Idea | Q1 Market | Q2 User | Q3 Moat | Q4 Exec | Q5 Demand | 判决 |
   |---|---|---|---|---|---|---|
   | ... | 🟢🟡🔴 | ... | ... | ... | ... | GO/NO-GO/PIVOT |

2. **每条 idea 的关键证据**（≤3 句话引用最强的 fact）

3. **判决规则**：
   - 5/5 全绿 → GO（启动 Phase 3 验证资产）
   - 任一红 → NO-GO（明确说为什么）
   - 1-2 黄 → PIVOT（指出修正方向）
   - INSUFFICIENT EVIDENCE → 标 PIVOT 或 PAUSE，给"补什么证据"清单

4. **下一步动作**：
   - GO 的 idea：14 天内 3 个具体动作（含红灯触发条件）
   - NO-GO 的 idea：是否值得"留观察 30 天"
   - PIVOT 的 idea：补证据清单 + 升 Mid 时机

通用规则：
- 不当 yes-man，敢说"全部 NO-GO"
- token 充足，单 agent 报告 ≤700-900 字
- 全程中文输出
- 每个 Phase 完成后给 ≤3 行进度更新

【Step 6 — 写入历史记录】
任务结束后，更新模板末尾的"历史调用记录"表格：
| 日期 | Mode | Mining idea pool 数 | Hard Facts 验证数 | 最终 GO/NO-GO/PIVOT 数 | 备注 |

【Step 7 — Mid → 验证资产升档（可选）】
如果 Step 5 输出 ≥1 条 GO，问"是否启动 Phase 3 生成验证资产？"
我说 yes 才跑（参考 Maximum Mode 的 Phase 3）。

期望产出：
- ≤40min wall time
- 4 份 mining JSON + 5 份 hard facts 报告 + 主对话 VC 五问矩阵
- 0 编造 URL / 0 命中 KILL list / 0 训练数据当现状

开始执行 Step 1。
```

### Mid Mode 反 yes-man 自检（每次跑完必答）

跑完 Mid 必须报告：
1. Mining idea pool 数 vs 进入 Hard Facts 验证的 idea 数（应有 ≥30% 筛除率）
2. F1-F5 各自给出 INSUFFICIENT EVIDENCE 的 idea 数
3. 最终 VC 五问全绿（GO）的 idea 数（**0 是合理结果，不必硬挑**）
4. 命中 D1-D4 / N1-N4 各规则的次数
5. **本次 Mid 是否触发了 ritual 风险**：是否在没有"直觉强烈"前提下跑 Mid（自我评估）

如果连续 2 次 Mid 跑出来 GO 数 = 0 且 INSUFFICIENT 数高 → 反向警告：**可能 idea pool 本身质量不够支撑 Mid**，回归 Lite + Lite-X 节奏，3 个月内不再升 Mid。

---

## 🆕 Lite-X 解锚探索 SKU（2026-04-27 新增）

### 为什么需要解锚

**2026-04-27 首次正式 Lite 实战的元 lesson**：4 个 agent 的输出 80% 都收敛到 AI cheatsheet 主线的子分发优化（高相关 / 低惊喜）。原因是 brief 锚定了「与 AI cheatsheet 协同 ≥8/10 优先」。

**Lite-X 是反向 SKU**：用同 4 平台 agent，但**移除主线锚定**，让 agent 在 Colar 完全没碰过的赛道挖。

### 触发词

`跑下解锚 Lite` / `Money Finder 解锚` / `Lite-X` / `跑下 Money Finder Explore`

### 频率上限

**每月 ≤1 次**（不是每周）—— 执行成本高 + ROI 不确定 + 防 ritual

### Lite-X 与 Lite 的核心差异

| 维度 | Lite（锚定）| Lite-X（解锚）|
|---|---|---|
| 找什么 | 已有方向的分发优化 + 红海避坑 | Colar 完全没碰过的新赛道 |
| 主线锚定 | "与 AI cheatsheet 协同 ≥8/10 优先" | **移除** |
| 主号反推 | "Colar 在折腾"内容栏目 | **移除** |
| 复合人设 niche | "留学生+量化+AI agent 创业者" 评分 | **移除** |
| 弱边界 | 隐含在主线里 | **显式 4 条**（见下）|
| 新增评分 | - | surprise score (0-10) |
| Agent 强制 | - | 每个 agent ≥2 条新赛道 idea |
| 期望产出 | 高相关 / 低惊喜 | 低相关 / 可能高惊喜 |

### Lite-X 弱边界（4 条硬约束，每个 agent prompt 顶部注入）

```
身份背景：UPenn Systems Eng MS 在读 / Nottingham 本科 Financial Math / F-1 中国公民 / 已上线 AI cheatsheet（不要再围绕它做）

弱边界（必须满足全部 4 条，否则 idea KILL）：
1. 单人可执行（1 个开发者 / 每周 ≤5h 可起的 MVP）
2. 1-2 周内能起 MVP（不接受需要 6 个月才出 v1 的方向）
3. 不需要 license / 不需要硬件 / 不需要团队（排除：医疗 / 律师 / 持牌金融 / 制造业 / 重运营线下）
4. 留学生身份能用上（信息差 / 跨文化 / .edu 邮箱 / F-1 视角 / 中美双语 / 海外学生 sourcing 任一即可）

mining 硬规则：
- 必须用 WebSearch + WebFetch 真访问
- 每条 finding 必须给真实 URL（≥5 个 N）
- 抓不到 → INSUFFICIENT EVIDENCE 不补造
- **不要**反推主号 / 不要评 cheatsheet 协同 / 不要"复合人设" niche

surprise score（0-10）评分维度：
- 距 Colar 已有 portfolio（cheatsheet / Hermes / KS）越远 = 分越高
- 与 4-27 已 mining 的 idea 重叠 = 分越低
- 跨赛道（金融科技 / B2B SaaS / 海外华人垂类 / 文娱 / 工具链等）= 加分
```

### Lite-X 一键启动包

```
任务：跑 Money Finder Lite-X（解锚探索）。让 4 个平台 agent 找 Colar 完全没碰过的新赛道，不要围着 AI cheatsheet 转。

工作流：
1. 并行启动 M1-M4（subagent 类型同 Lite）
2. 每个 agent 注入解锚硬约束（见上方 4 条弱边界）
3. 每个 agent 强制：≥2 条 surprise score ≥7 的新赛道 idea
4. 主对话整合 4 份报告 → 输出：
   - 跨赛道 idea pool（按 surprise score × 弱边界全过 排序）
   - 每条 idea 的弱边界 4 项验证（全过 ✅ / 部分过 ⚠️ / KILL）
   - 与 cheatsheet 重叠的 idea 标注「重叠主线」并降权
   - Mid 档升档建议（哪条值得做付费意愿验证）

期望输出：
- ≤30min wall time
- ≥6 条 idea（4 平台 × ≥2 条新赛道，去重后）
- ≥3 条 surprise score ≥7 + 弱边界全过
- 重叠 cheatsheet 的 idea 全部标注降权

警告：解锚 Lite-X 默认每月 1 次。如果连续 2 次跑出来都没 surprise ≥7 的 idea，触发 reference_money_finder_workflow 的反 ritual 红线，暂停 Lite-X 至少 60 天。

开始。
```

### Lite-X 反 yes-man 自检（每次跑完必答）

跑完 Lite-X 必须回答以下问题，写进 latest.md 底部：

1. **本次 surprise score ≥7 的 idea 数量**：__（如果 0 → 报告 INSUFFICIENT，下次 Lite-X 等 60 天）
2. **本次哪条 idea 你最想 execute**？（必须明确选 1 条，不能"都想"）
3. **14 天内你会做什么具体动作来验证它**？（不接受"再调研"，必须是动作如"用户访谈 N=5 / 写 landing page / 发小红书测帖"）
4. **如果 14 天后第 3 问的动作没做** → 触发 ritual 红线，Lite-X 暂停 60 天

### 与 Lite 的协同关系

- Lite-X 是 Lite 的**补集**：Lite 优化已有方向，Lite-X 找新方向
- 不要同月跑 Lite + Lite-X（决策疲劳 + ritual 风险）
- 如果 Lite-X 跑出强 idea，下个月可以跑 Lite-X→Mid 升档（hard facts 验证）
- 如果 Lite-X 连续 2 次 INSUFFICIENT，回归 Lite 节奏

---

## 🔧 P3 工具评估 4-agent 模板（2026-04-26 流程元评估新增）

适用：**自用 P3 基础设施工具**的 kill / maintain / invest 决策（trending_aggregator 类）。
原则：不堆 17 agent，4 agent 已覆盖核心视角，避免仪式化。

**前置闸门**：必须先过 sunk-cost gate 3 问，**不通过 → 直接套 P3 软 kill SOP，不跑 4-agent**。

### 4 agent 配置

| 序 | 角色 | subagent_type | 核心问题（不重复其他 agent） |
|----|------|---------------|--------------------------|
| 1 | R7 赛道竞品 | general-purpose | 这赛道有没有死亡名单？活着的怎么活的？ |
| 2 | D1 信号本质 | product-trend-researcher | 工具命名是否在制造噪音？是不是伪需求？ |
| 3 | D3 行为决策 | specialized-behavioral-decision-scientist | 用户在论证方向还是论证沉没？sunk cost / goal substitution 诊断 |
| 4 | A3 NEXUS 仲裁 | general-purpose | 整合 R7/D1/D3，给具体 30min 动作 |

**执行结构**：A1+A2+A3 并行（不串行），A4 NEXUS 接收三份并行报告做整合（不做新独立判断）。

### 升级触发条件

- D1 vs D3 结论冲突 → 升级 **7-agent MVMM**（加 R8 dev signal + D2 JTBD + A2 reality-checker）
- R7 显示赛道未饱和 → 升级 **7-agent MVMM**
- 同类 SOP 已套用 ≥ 2 次 → **不跑 4-agent，直接套 SOP**（[feedback_p3_tool_one_battle_sop.md](../../../Users/Colar/.claude/projects/c--Users-Colar-Desktop-agency-agents/memory/feedback_p3_tool_one_battle_sop.md)）

### 一键粘贴启动包（4-agent）

```
任务：对 [项目名] 跑 P3 工具评估 4-agent 模式。

闸门 3 问（必答，不答则降级 mini-quick mode 2 agent）：
1. 如果今天有人给你一个相同功能的工具免费用，你还会选自己这个吗？
2. 你是在论证"这个方向值得做"还是"已投入的不该浪费"？
3. Phase 1 出现哪 3 条数据会让你立刻 abort 评审？

我的回答：
- Q1: ___
- Q2: ___
- Q3: ___

3 问全过 → 启动 4-agent 并行（参考 Max Mode R7 / D1 / D3 / A3 的 prompt 模板，简化到 ≤500 字/agent）：
- A1: general-purpose 赛道竞品 / 死亡名单
- A2: product-trend-researcher 信号 vs 噪音本质
- A3: specialized-behavioral-decision-scientist sunk cost + goal substitution 诊断
- A4: general-purpose NEXUS 整合 + 30min 动作

A1-A3 并行，A4 接 3 份报告做整合（不做新独立判断）。
```

**预期耗时**：15-25 分钟。**Token 消耗约为 17-agent 的 25%**。

---

## 数据源

- **热点榜单**：[scripts/trending_aggregator/latest.md](latest.md)
- **历史快照**：[scripts/trending_aggregator/snapshots/](snapshots/)
- **NEXUS 方法论**：`c:\Users\Colar\Desktop\agency-agents\.claude\agents\nexus-strategy.md`

---

## 历史调用记录（供未来对比）

| 日期 | Mode | DIG 候选数 | 最终 ACT 数 | 备注 |
|------|------|-----------|------------|------|
| 2026-04-26 | Quick | 4 | 1（DeepSeek V4 路由） | 首次跑，验证 mental model |
| 2026-04-26 | Maximum | 1（DeepSeek V4 迁移工具） | **0（全砍）** | 17 agent 专家陪审团首跑。粗筛仅 1 条 DIG 候选（低于 3 条门槛但 token 充足继续）。Phase 0 揭示红海 + Humanloop $7.91M 死亡反例；Phase 1 D1 vs D6 出现"当下不动手 vs MVP C concierge"最大分歧；A1 红队 3/10 + 4/10 双 RED FLAG；A2 VC 五问 0/5 全绿（4 红 1 黄），护城河 < 4h 可复制致命；A3 NEXUS NO-GO，建议改推 AI cheatsheet。降级方案：迁移过程自然产生踩坑笔记则 ≤3h 写 1 篇博客（不主动写）。|
| 2026-04-26 | Maximum（适配版） | n/a（评估对象=工具本身非 idea） | **软 kill** | **17 agent 评审 trending_aggregator 脚本本身**。Phase 0 8 agent 信号源诊断（zhihu 0/20 空转、抖音 weight 不合理、B 站抓错表、X trends 0/20 founder 信号、Reddit 缺位 45min ROI 最高、6:4 中英比应改 3:7、raw aggregator 死两轮 RSS+Pocket、D3 8 候选只 3 真值得）；Phase 1 D1 PAUSE / D2 watchdog / D3 sunk cost rationalization / D4 净维护负值 / D5 niche 重构 / D6 5h 修破窗；A1 红队 5 方案全 ≤5 分（修破窗 3/10 是最强诱饵）；A2 reality check 否决 A1 硬 kill（Q1+Q5 INSUFFICIENT），Hard Floor 软 kill；A3 NEXUS 终判 A2 软 kill PASS。30 分钟动作：注销 schtasks + STATUS.md + memory 引用。30 天 review trigger（< 3 次主动打开 → 硬 kill）。**Meta Lesson: P3 工具 1 战定生死 SOP**（[feedback_p3_tool_one_battle_sop.md](../../../../../Users/Colar/.claude/projects/c--Users-Colar-Desktop-agency-agents/memory/feedback_p3_tool_one_battle_sop.md)），下次第 3 个 P3 工具直接套不再走完整评审。 |
| 2026-04-27 | Maximum + Hard Facts + Platform Mining（**26 agent 全跑**）| 2（Manus + 国产开源大模型）| **0 GO（Idea 评估层）+ idea pool 20 条**（用户纠偏后输出）| **元 lesson 跑：先跑 17 agent max mode → 4 agent hard facts 核查（78 web tools）→ 4 agent platform mining（61 web tools）。揭示**：(1) trending top 20 = 注意力市场不是需求市场，新闻周期 < 7 天；(2) 17 agent max mode ROI 中等，~30% 输出虚假精度（编 URL、误读 Patronus 63% 数学含义、误读 Nature 30% 准确率为幻觉率、Manus 形式标签 reverse acqui-hire 实为真收购、漏 Genspark 反例、漏 4-27 中国 NDRC unwind 真因）；(3) 4 hard facts agent 修正 8 处虚假精度 + 挖出关键 fact（Manus 4-27 unwind / Anthropic /rewind 已 ship / Langfuse 被 ClickHouse 收 / Qwen3.6 GGUF 跑不了 Ollama）；(4) **4 platform mining ROI 最高**——M1 小红书给具体钩子模板（"$1 一门课 cheatsheet"+ tag ≤10）+ 复合人设稀缺性 8/10；M3 B 站给 6 大小白困惑 + 4 大教程内容真空；M4 Reddit 给 5 个真 r/LocalLLaMA bug thread。**Meta Lesson：M1-M4 比 17 agent 价值高 5×**，trending 仅作辅助信号。**SOP 元改**：默认 SKU 改为 4 Platform Deep Mining（见上方章节），trending → max mode 路径降级为 archive。|

---

## 🆕 Lite Mode v2 Hardening（2026-04-27 落地）

3-agent 讨论（Software Architect + Reality Checker + Behavioral Decision Scientist）后落地的 12 条规则 + 3 个工程优化。**触发词同 Lite，执行规则升级**（旧版用 `跑下 Lite v1` 显式调用）。

### 🔧 工程优化（编排层，主对话执行）

#### E1 — WebFetch 定向抽取
所有 WebFetch 必须带 `prompt=` 参数。**禁止默认全页 markdown 拉取**（5-10K token / 页 vs 500-1K）。
```
WebFetch(url, prompt="只返回前 5 个高赞评论原文 + 发布时间 + 互动数，JSON 格式")
```

#### E2 — Agent 输出 JSON Schema（不写自由 markdown）
```json
{
  "platform": "xiaohongshu|douyin|bilibili|reddit",
  "ideas": [
    {
      "title": "...",
      "url_tag": "PRIMARY|SYNDICATED|MARKETING",
      "url": "https://...",
      "url_status": "200|404|...",
      "page_title_first_30": "...",
      "post_timestamp": "2026-04-XX|UNKNOWN",
      "raw_quote": "≤40字 用户原话",
      "evidence_count": 5,
      "signal_strength": 7,
      "demand_type": "REAL|ATTENTION_ONLY",
      "killed_by": null,
      "seasonal_factor": 1.0
    }
  ],
  "kill_list": [...]
}
```

#### E3 — 主对话预搜 batch
**Lite 启动时主对话先跑 1 轮 WebSearch**（4 平台关键词 batch），把 snippet + URL 整理成 80-line brief 注入 4 agent。
agent 不再独立 WebSearch（除非 brief 有 gap），只做 WebFetch 深挖。
**附带修 marketing agent INSUFFICIENT bug**（Xiaohongshu Specialist / Douyin Strategist 工具池不含 WebSearch 不再是问题）。

### 🛡️ 数据真伪规则（D1-D4，注入每个 agent prompt 顶部）

#### D1 — URL 三类源标签强制
- `[PRIMARY]`：xiaohongshu.com / douyin.com / bilibili.com / reddit.com
- `[SYNDICATED]`：sohu.com / csdn.net / 知乎转载 / cnblogs.com
- `[MARKETING]`：27sem.com / wuwuseo.com / 任何 SEO 营销博客

**触发动作**：
- SYNDICATED → signal_strength × 0.5 自动降权
- MARKETING → 不进 ideas[] 主表，进 sources_appendix
- 单平台 PRIMARY <2 条 → 该平台 mining 整体作废重跑

#### D2 — URL 可达性 gate
每条 URL 必须含 `url_status` (HTTP 状态码) + `page_title_first_30` (页面 title 前 30 字)。
- 不可达 / 404 / title 空 → 该 idea 自动剔除
- 同 agent ≥2 条不可达 → **整次 mining KILL**（trending_aggregator 编造 URL 案件已 KILL，不重蹈）

#### D3 — 时间戳硬切线
每条 idea 必须含 `post_timestamp`，要求 ≥ today - 90d。
- 早于 90 天 → 不进 trending，标 OUTDATED 进附录
- 拿不到时间戳 → `post_timestamp: "UNKNOWN"`，signal_strength × 0.7 自动降权
- **禁止用训练数据估计当现状**（拦截 LLM 用 2024 截止当 2026 现状）

#### D4 — 数字双源验证
凡硬数字（GMV / 播放量 / 涨粉数 X 万）必须 ≥2 个 PRIMARY 源交叉。
- 单源数字 → 标 `[UNVERIFIED]` 进 sources_appendix，不进 ideas 主表的市场验证字段

### 🔇 噪声过滤规则（N1-N4，注入每个 agent prompt 顶部）

#### N1 — 敏感黑名单 hard reject
信号文本/标签命中以下任一立即 **drop（不解释，避免分散注意力）**：
- 政治：政治 / 习 / 党 / 军演 / 台湾 / 香港 / 新疆 / 西藏 / 涉港 / 涉台 / 涉外
- 宗教：达赖 / 法轮 / 涉宗教 / 伊斯兰 / 基督教 / 佛教商业化
- 医疗：中医 / 处方药 / 医美 / 减肥药
- 金融违规：股票推荐 / 炒币 / 赌博

理由：触发审查/法律风险的期望损失 >> 期望收益。

#### N2 — 流量 vs 需求二分
仅有"播放量/热搜排名/点赞数"，无以下任一证据 → 标 `demand_type: "ATTENTION_ONLY"`，signal_strength ≤ 2/10：
- 搜索量增长趋势
- 评论区"求教程/求链接/怎么做/多少钱"占比 ≥15%
- 收藏率 ≥ 5%
- 重复购买/复购话题
- 知乎/小红书"求助"贴

ATTENTION_ONLY 仅在 idea pool 末尾"弱信号待观察"区出现，不进 top 推荐。

#### N3 — User Memory KILL list 强制对齐
检查 idea 是否命中（每次跑 Lite 前从 user memory 动态读取最新 KILL list）：
- AI 副业卖课 / prompt 工程师培训 / ChatGPT 使用教程 / AI 写作变现 / 知识付费搬运
- AgentEval / trending_aggregator 类聚合工具
- 通用 PDF→study notes me-too / 通用视频转笔记
- 双语 AI 接单 / 卖方法论
- 教材替代 LibGen 清单（已重叠）

命中 → drop + `killed_by: "kill_list_match"` 显式标注。**不允许"换包装重推"**（同语义簇也 drop）。

#### N4 — 季节性衰减折扣
信号关联词命中：报税 / 春招 / 秋招 / 申请季 / 双 11 / 开学季 / 毕业季 / 考研 / 高考 / 春节红包 → 计算 `days_to_peak_decay`：
- 衰减系数 = max(0, (30 - days_to_peak_decay) / 30)
- < 14 天 → drop（窗口已过）
- ≥ 14 天 → signal_strength × 衰减系数

记入 `seasonal_factor` 字段。

### Lite v2 启动包（替换之前 Lite v1 启动包）

```
任务：跑 Money Finder Lite v2（hardened）。

方向：[用户当下指定的方向，未指定先问]

主对话执行（编排层）：
1. 先跑 4 平台 WebSearch batch（关键词参考 4 Platform Mining 章节），整理 snippet brief
2. 把 brief + 全部 12 条 Hardening 规则（D1-D4 + N1-N4）注入 M1-M4 agent prompt
3. agent 用 general-purpose 类型（避免 marketing agent 工具池 bug），扮演平台专家
4. agent 输出严格 JSON schema（E2），WebFetch 必须带 prompt 参数（E1）
5. 主对话综合 4 份 JSON，按 signal_strength × seasonal_factor × url_tag 降权 排序

期望输出：
- ≤30min wall time
- token 节省 ~50%（vs Lite v1）
- 0 编造 URL（D2 gate）
- 0 命中 KILL list / 黑名单（N1+N3）
- ATTENTION_ONLY 信号下沉到附录（N2）

开始。
```

### Hardening 反 yes-man 自检（每次跑完必答）

跑完 Lite v2 必须报告以下统计：
1. 4 平台各 PRIMARY / SYNDICATED / MARKETING 各几条
2. URL 可达性失败率（应 <10%，否则 D2 触发警告）
3. 命中 KILL list / 黑名单的 idea 数量（show your work）
4. 季节性衰减后被 drop 的 idea 数
5. 最终 idea pool 比 Lite v1 减少了多少（预计 30-50%，否则规则没生效）

如果连续 2 次 Lite v2 跑出来这些统计**全为 0**（说明规则没触发任何过滤）→ 反向警告：**规则可能写得太宽**或**搜索源本身已被前置过滤**，需要复审 Hardening 规则本身。
