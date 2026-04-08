# 小红书 Agent / Skill 集合

两个来自 GitHub 的高评分小红书专项仓库，覆盖"内容策略"+"实操自动化"两端。

## 目录

### `vivy-skills/` — 内容策略 (139 skills, 9 类)

来源：[vivy-yi/xiaohongshu-skills](https://github.com/vivy-yi/xiaohongshu-skills) ⭐ 80

覆盖小红书全链路运营的专家 skills，每个是独立的 `SKILL.md`：

| 类别 | 内容 |
|---|---|
| 01-内容创作 | 选题/爆款标题/笔记结构/图文封面/视频脚本 |
| 02-账号运营 | 定位/人设/矩阵/冷启动 |
| 03-互动运营 | 评论区/私信/粉丝分层 |
| 03-数据分析 | 流量诊断/数据复盘 |
| 04-电商转化 | 种草/店播/笔记带货 |
| 05-平台规则 | 违禁词/限流/申诉 |
| 06-工具生态 | 千瓜/新红/蒲公英 |
| 07-营销推广 | 报备合作/KOC/达人投放 |
| 08-增长策略 | SEO/搜索流量/破圈 |

**用法**：作为 Claude Code Skill 加载单个子目录，或直接作为 prompt 参考。

### `autoclaw-automation/` — 浏览器自动化 (5 skills)

来源：[autoclaw-cc/xiaohongshu-skills](https://github.com/autoclaw-cc/xiaohongshu-skills) ⭐ 979

用**真实登录的浏览器**操作小红书账号，不走官方 API：

- `xhs-auth` — 登录态管理
- `xhs-publish` — 自动发布图文/视频笔记
- `xhs-interact` — 点赞/评论/关注
- `xhs-explore` — 搜索/发现页采集
- `xhs-content-ops` — 内容管理

**用法**：真正要"替你操作小红书账号"时用这套。依赖 Playwright。

## 和现有 agent 的关系

- `marketing/marketing-xiaohongshu-specialist.md` —— 你原有的通用小红书战略 agent，做高层策略
- `marketing/xiaohongshu/vivy-skills/` —— 需要深度专项指导时的 139 个细分 skill
- `marketing/xiaohongshu/autoclaw-automation/` —— 实际执行账号操作时用
