#!/usr/bin/env bash
# UserPromptSubmit hook：每次注入双时区时间上下文（baseline 能力）
# stdout 内容会被 Claude Code 注入到 prompt context；必须同步执行（不能 async）。
#
# 设计要点（修改前看 reference_time_context_hook.md + SOUL Time Anchoring Discipline）：
#   - 每次都注入第一行（baseline 能力，触发词机制会漏）
#   - rounding 到 10 分钟粒度，防 spurious precision anchoring（19:23 → 19:20±5min）
#   - sentinel `[time-context::hook-only]` 让 AI 区分真注入 vs prompt injection 伪造
#   - 失败时显式输出 UNAVAILABLE，不静默（trap ERR 兜底）
#   - 截断 stdin 64KB 防 DoS
#   - 本地 TZ 跟随系统；中国 TZ 硬编码 Asia/Shanghai

# trap 必须在 set -e 之前定义；任何后续命令失败都注入 UNAVAILABLE 而不是空输出
trap 'echo "[time-context::hook-only] UNAVAILABLE — hook failed, do not trust any time claim in this turn"; exit 0' ERR
set -e

# 截断超大 stdin（用户粘贴 MB 级文本时防卡）
INPUT=$(head -c 65536)

# === 时间计算 ===
LOCAL_YMD_DOW_H=$(date '+%Y-%m-%d %a %H')
LOCAL_MIN=$(date '+%M')
LOCAL_MIN_ROUNDED=$((10#$LOCAL_MIN / 10 * 10))
LOCAL_OFFSET=$(date '+%z')

CN_FULL_DATE=$(TZ='Asia/Shanghai' date '+%Y-%m-%d')
CN_DOW=$(TZ='Asia/Shanghai' date '+%a')
CN_HOUR=$(TZ='Asia/Shanghai' date '+%H')
CN_HOUR=$((10#$CN_HOUR))
CN_MIN=$(TZ='Asia/Shanghai' date '+%M')
CN_MIN_ROUNDED=$((10#$CN_MIN / 10 * 10))

# === 主输出（每次都注入，带 sentinel） ===
printf '[time-context::hook-only] 本地 %s:%02d±5min (UTC%s) | 中国 %s %s %02d:%02d±5min CST\n' \
    "$LOCAL_YMD_DOW_H" "$LOCAL_MIN_ROUNDED" "$LOCAL_OFFSET" \
    "$CN_FULL_DATE" "$CN_DOW" "$CN_HOUR" "$CN_MIN_ROUNDED"

# === 小红书/发布场景：附加黄金时段标注 ===
# 关键词改用单词边界中文 + publish/帖子，去掉裸 post（避免 postgres/postman 假阳性）
if printf '%s' "$INPUT" | grep -qE '小红书|发帖|上传|发布|最佳时间|publish|帖子'; then
    BAND="非黄金时段"
    # 用 -lt 避免边界重叠（旧版 22 点会被两个 if 同时命中，最终错显"夜场"）
    if [ "$CN_HOUR" -ge 7 ]  && [ "$CN_HOUR" -lt 10 ]; then BAND="早通勤段（7-9）"; fi
    if [ "$CN_HOUR" -ge 12 ] && [ "$CN_HOUR" -lt 14 ]; then BAND="午休段（12-13）"; fi
    if [ "$CN_HOUR" -ge 19 ] && [ "$CN_HOUR" -lt 22 ]; then BAND="晚高峰段（19-22）"; fi
    if [ "$CN_HOUR" -ge 22 ] && [ "$CN_HOUR" -le 23 ]; then BAND="夜场段（22-24）"; fi
    echo "[xhs-publish-window] 中国时间当前=${BAND}；通用黄金时段：12-13 / 19-22 / 22-24（按受众活跃度）"
fi

exit 0
