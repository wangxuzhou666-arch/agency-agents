# agency-agents — 工作流框架

## Task Tier Selection

根据任务规模选 Tier，不要对所有任务用同一套流程。

> ⏱️ **时间口径**：以下所有时间估计都是**使用 AI（Claude Code）协作完成**的预期耗时，不是手写代码的耗时。

### Tier 1 — Micro（< 30min，单文件/单函数修改）

```
act → /diff → commit
```

不需要 plan，不需要 review，直接改。

---

### Tier 2 — Feature（30min~2h，跨文件改动）

```
① 加载上下文（读相关文件，识别依赖）
② 选 agents（根据任务域选 1-3 个专项 agent）
③ 输出方案（架构决策 + 影响范围 + 风险点）
④ YOLO 执行（act then inform，不中途停下来问）
⑤ /diff（在 build 之前看，提前发现方向偏差）
⑥ build / test 验证
⑦ /review（code quality + 安全 + 逻辑）
⑧ save memory（非显而易见的决策）
⑨ commit
```

---

### Tier 3 — Architecture（2h+，跨 session 重构/新系统）

```
① 加载 memory + 上下文（读 MEMORY.md + README + git log）
② 选 agents（Workflow Architect + 相关专项，最多 5 个）
③ EnterPlanMode → 完整方案（含数据流/接口/风险/被排除方案）
④ 确认方案后 ExitPlanMode，开始执行
⑤ 每个子模块完成 → /diff → 小步 commit
⑥ build / test（每个 milestone 验证一次，不是最后才跑）
⑦ /review
⑧ save memory（关键架构决策的 trade-off + 被排除方案的原因）
⑨ PR
```

---

## Agent 自动发现（三层架构）

Agents 已按项目分层部署，Claude Code 自动发现，不需要手动指定：

```
Tier 1: ~/.claude/agents/         ← 7 个万能 agent，所有项目可用
Tier 2: <project>/.claude/agents/ ← 按项目精选的专项 agent
Master: ~/Desktop/agency-agents/  ← 100+ agent 的单一真相源（不直接加载）
```

**同步方式**：每个项目的 `.claude/agent-config.yaml` 声明需要哪些 agent，运行 `bash scripts/sync-all.sh` 从 master library 复制到项目的 `.claude/agents/`。

**新增 agent 到项目**：编辑项目的 `.claude/agent-config.yaml`，然后运行 `bash ~/Desktop/agency-agents/scripts/sync-agents.sh <project-path>`。

**不要手动往 `~/.claude/agents/` 或 `.claude/agents/` 放文件**——用 sync 脚本管理，保持单一真相源。

## Agent 选择原则

| 任务类型 | 怎么选 |
|---------|--------|
| 一般工程 | 自动 — Tier 1 的 Software Architect / Senior Dev / Code Reviewer 覆盖 |
| 安全审计 | `/cso` 或项目已部署的 Security Engineer |
| 方案设计 / 架构 | Workflow Architect（Tier 1 自带） |
| **UI/UX 设计** | **走下方 UI/UX Pipeline（必经 Design Bridge）** |
| 专项领域 | 项目的 `.claude/agents/` 里已部署的专项 agent |
| 多领域交叉 | 最多选 3 个并行跑，不要超过 5 个 |

---

## UI/UX Design Pipeline（所有界面设计任务必走此流程）

凡涉及 UI 设计、视觉风格、组件库、CSS 架构、交互模式的任务，**不要用通用 agent 凑**，走以下 pipeline：

```
① Design Bridge（前置，必经）
   ↓ 确定目标品牌 → fetch DESIGN.md → 输出 instructions-{brand}.md
   ↓
② 并行分发（根据任务类型选 1-2 个）
   ├── UI Designer      → 组件设计、设计系统、视觉规范
   ├── UX Architect      → CSS 架构、layout 框架、响应式策略
   └── UX Researcher     → 用户调研、可用性测试（如有需要）
   ↓
③ Frontend Developer → 实现落地
   ↓
④ /diff → build → /review
```

### 触发条件（满足任一即走此 pipeline）

- 用户说"设计"、"UI"、"界面"、"样式"、"风格"
- 新建前端项目或页面
- 重构/重新设计已有界面
- 用户提到任何品牌名作为视觉参考（如"像 Linear 那样"）

### Design Bridge 是门卫

- **不跳过**：即使是"简单改个按钮颜色"，也先检查有没有已存在的 design spec
- **66 品牌可选**：Claude, Linear, Vercel, Stripe, Notion, Figma, Apple, Spotify 等
- **输出位置**：`.claude/design/instructions-{brand}.md`，后续 agent 直接读
- **用户没指定品牌时**：主动问"你想对标哪个产品的视觉风格？"

---

## /diff 使用时机

**在 build 之前，不是之后。**

改完就 diff，发现方向偏差立即纠正，不等到 test 失败才回头。

---

## Memory Save 节点（Tier 2/3 结束时）

只存非显而易见的内容：
- 被排除的方案及原因
- 关键架构决策的 trade-off
- 下次 session 需要继承的上下文

不存：代码模式、文件路径、git 历史（这些直接读代码）。

---

## 语言

默认用中文回答。除非用户明确指定用英文，否则所有回复、解释、方案输出均使用中文。

---

## YOLO 默认姿态

act then inform，不问再行动。

只在以下情况停下来确认：
- force push / 删文件 / 删分支
- 向外部服务发送消息或产生费用
- 不可逆的基础设施变更
