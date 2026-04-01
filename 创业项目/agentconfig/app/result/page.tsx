'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const SCAN_STEPS = [
  {
    label: '上下文',
    duration: 3200,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="1.5" fill="#f472b6" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" fill="#fb923c" opacity="0.8" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" fill="#a78bfa" opacity="0.8" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" fill="#60a5fa" opacity="0.7" />
      </svg>
    ),
  },
  {
    label: '记忆',
    duration: 3200,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <path d="M9 3C6.24 3 4 5.24 4 8c0 1.45.58 2.76 1.52 3.72A4 4 0 004 15c0 2.21 1.79 4 4 4h8a4 4 0 000-8 3.99 3.99 0 00-1.52-3.72A4 4 0 0015 3H9z" fill="#c084fc" opacity="0.9"/>
        <circle cx="9" cy="10" r="1.2" fill="#e9d5ff"/>
        <circle cx="15" cy="10" r="1.2" fill="#e9d5ff"/>
        <path d="M9 14h6" stroke="#e9d5ff" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: '工具',
    duration: 4000,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: '路由',
    duration: 4000,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <path d="M4 6h16M4 12h10M4 18h6" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="18" cy="12" r="3" stroke="#2dd4bf" strokeWidth="1.8"/>
        <circle cx="14" cy="18" r="3" stroke="#2dd4bf" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    label: '大模型',
    duration: 5600,
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" fill="#fbbf24"/>
        <path d="M19 14l.8 2.2 2.2.8-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" fill="#fbbf24" opacity="0.7"/>
        <path d="M5 17l.5 1.5 1.5.5-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" fill="#fbbf24" opacity="0.5"/>
      </svg>
    ),
  },
]

function ScanningLoader() {
  const [completedCount, setCompletedCount] = useState(0)
  const [activeProgress, setActiveProgress] = useState(0)
  const [counter, setCounter] = useState(0)
  const [countdown, setCountdown] = useState(20)
  const [animDone, setAnimDone] = useState(false)
  const [waitSeconds, setWaitSeconds] = useState(0)
  const [tipIdx, setTipIdx] = useState(0)

  useEffect(() => {
    let cancelled = false

    function animateStep(idx: number) {
      if (cancelled) return
      if (idx >= SCAN_STEPS.length) {
        setAnimDone(true)
        return
      }
      const duration = SCAN_STEPS[idx].duration
      const start = performance.now()

      function tick(now: number) {
        if (cancelled) return
        const pct = Math.min(100, ((now - start) / duration) * 100)
        setActiveProgress(pct)
        if (pct < 100) {
          requestAnimationFrame(tick)
        } else {
          setCompletedCount(idx + 1)
          setActiveProgress(0)
          animateStep(idx + 1)
        }
      }
      requestAnimationFrame(tick)
    }

    animateStep(0)

    const counterInt = setInterval(() => {
      if (!cancelled) setCounter(p => p >= 3000 ? 3000 : p + Math.floor(Math.random() * 18 + 6))
    }, 80)

    const countdownInt = setInterval(() => {
      if (!cancelled) setCountdown(p => Math.max(1, p - 1))
    }, 1000)

    return () => {
      cancelled = true
      clearInterval(counterInt)
      clearInterval(countdownInt)
    }
  }, [])

  // 动画跑完后循环最后一步的进度条
  useEffect(() => {
    if (!animDone) return
    let cancelled = false
    const loopDuration = 2000
    const loopStart = performance.now()

    function loopTick(now: number) {
      if (cancelled) return
      const elapsed = (now - loopStart) % loopDuration
      setActiveProgress((elapsed / loopDuration) * 100)
      requestAnimationFrame(loopTick)
    }
    requestAnimationFrame(loopTick)
    return () => { cancelled = true }
  }, [animDone])

  // 动画跑完后开始计等待秒数
  useEffect(() => {
    if (!animDone) return
    const waitInt = setInterval(() => setWaitSeconds(p => p + 1), 1000)
    return () => clearInterval(waitInt)
  }, [animDone])

  // 动画完成后轮播小贴士
  const TIPS = [
    { icon: '⚡', text: 'Agent = 你的数字分身，同时处理你扔过来的多件事' },
    { icon: '🧠', text: '一份好的 System Prompt 能省掉 80% 的重复解释' },
    { icon: '🔗', text: 'Agent 可以记住你的工作风格，越用越顺手' },
    { icon: '🎯', text: '根据你的职业定制后，它的回答会精准 3 倍以上' },
    { icon: '🚀', text: '配置好之后，以前 30 分钟的事情 2 分钟就能搞定' },
  ]
  useEffect(() => {
    if (!animDone) return
    const tipInt = setInterval(() => setTipIdx(p => (p + 1) % TIPS.length), 3500)
    return () => clearInterval(tipInt)
  }, [animDone])

  // 动画完成后最后一步保持"处理中"
  const displayCompleted = animDone ? SCAN_STEPS.length - 1 : completedCount

  return (
    <div className="min-h-screen bg-[#060c18] flex flex-col items-center justify-center p-6">
      {/* Header */}
      <p className="font-mono text-xs tracking-[0.25em] text-cyan-500 mb-4">
        // SYSTEM SCANNING
      </p>
      <h1 className="text-2xl font-bold text-white mb-8">正在分析你的需求配置...</h1>

      {/* Steps card */}
      <div className="w-full max-w-md bg-[#0a1628] border border-slate-700/60 rounded-2xl overflow-hidden mb-8">
        {SCAN_STEPS.map((s, i) => {
          const done = i < displayCompleted
          const active = i === displayCompleted
          return (
            <div key={s.label} className={`px-5 py-3.5 ${i < SCAN_STEPS.length - 1 ? 'border-b border-slate-800/70' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 opacity-90">
                  {s.icon}
                </div>
                <span className="text-sm font-mono text-slate-300 flex-1">
                  [<span className={done ? 'text-emerald-400' : active ? 'text-cyan-300' : 'text-slate-500'}>{s.label}</span>]
                </span>
                <span className={`text-xs font-medium tabular-nums ${done ? 'text-emerald-400' : active ? 'text-cyan-400' : 'text-slate-600'}`}>
                  {done ? '完成' : active ? '处理中' : '等待中'}
                </span>
              </div>
              {/* Progress bar */}
              <div className="mt-2 ml-11 h-0.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-none ${done ? 'bg-emerald-500' : active ? 'bg-cyan-400' : 'bg-transparent'}`}
                  style={{ width: done ? '100%' : active ? `${activeProgress}%` : '0%' }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Counter */}
      <p className="text-slate-400 text-sm mb-1">
        已筛选{' '}
        <span className="text-white font-bold text-lg tabular-nums">
          {counter.toLocaleString('en-US')}
        </span>{' '}
        种方案组合
      </p>
      <p className="text-slate-600 text-xs mb-6">
        {animDone
          ? `AI 正在生成推荐方案，已等待 ${waitSeconds} 秒...`
          : `预计还需 ${countdown} 秒...`}
      </p>

      {/* Tips while waiting */}
      {animDone && (
        <div className="w-full max-w-md">
          <p className="text-slate-600 text-[10px] tracking-widest uppercase mb-2 text-center">— 你知道吗 —</p>
          <div className="bg-[#0a1628] border border-slate-700/50 rounded-xl px-4 py-3.5 flex items-center gap-3 min-h-[60px]">
            <span className="text-xl flex-shrink-0">{TIPS[tipIdx].icon}</span>
            <p className="text-slate-300 text-sm leading-relaxed">{TIPS[tipIdx].text}</p>
          </div>
          <div className="flex justify-center gap-1.5 mt-3">
            {TIPS.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === tipIdx ? 'w-4 bg-cyan-400' : 'w-1.5 bg-slate-700'}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface AgentComponent {
  name: string
  desc: string
  analogy: string
}

interface Recommendation {
  rank: number
  name: string
  tagline: string
  match_score: number
  platform: string
  difficulty: 'easy' | 'medium' | 'hard'
  setup_time: string
  weekly_time_saved: string
  what_it_does: string[]
  example_prompts: string[]
  system_prompt_template: string
  setup_steps: string[]
  cant_do: string
  why_this: string
  agent_components?: AgentComponent[]
}

const COMPONENT_LABELS = ['上下文', '记忆', '工具', '路由', '大模型']

const COMPONENT_ICONS = [
  <svg key="ctx" viewBox="0 0 24 24" className="w-6 h-6" fill="none">
    <rect x="3" y="3" width="8" height="8" rx="1.5" fill="#f472b6" />
    <rect x="13" y="3" width="8" height="8" rx="1.5" fill="#fb923c" opacity="0.8" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" fill="#a78bfa" opacity="0.8" />
    <rect x="13" y="13" width="8" height="8" rx="1.5" fill="#60a5fa" opacity="0.7" />
  </svg>,
  <svg key="mem" viewBox="0 0 24 24" className="w-6 h-6" fill="none">
    <path d="M9 3C6.24 3 4 5.24 4 8c0 1.45.58 2.76 1.52 3.72A4 4 0 004 15c0 2.21 1.79 4 4 4h8a4 4 0 000-8 3.99 3.99 0 00-1.52-3.72A4 4 0 0015 3H9z" fill="#c084fc" opacity="0.9"/>
    <circle cx="9" cy="10" r="1.2" fill="#e9d5ff"/><circle cx="15" cy="10" r="1.2" fill="#e9d5ff"/>
    <path d="M9 14h6" stroke="#e9d5ff" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  <svg key="tool" viewBox="0 0 24 24" className="w-6 h-6" fill="none">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  <svg key="route" viewBox="0 0 24 24" className="w-6 h-6" fill="none">
    <path d="M4 6h16M4 12h10M4 18h6" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="18" cy="12" r="3" stroke="#2dd4bf" strokeWidth="1.8"/>
    <circle cx="14" cy="18" r="3" stroke="#2dd4bf" strokeWidth="1.8"/>
  </svg>,
  <svg key="llm" viewBox="0 0 24 24" className="w-6 h-6" fill="none">
    <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" fill="#fbbf24"/>
    <path d="M19 14l.8 2.2 2.2.8-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" fill="#fbbf24" opacity="0.7"/>
  </svg>,
]

function parseHours(s: string): number {
  const m = s.match(/(\d+(\.\d+)?)/)
  return m ? parseFloat(m[1]) : 5
}

function calcEfficiencyBoost(rec: Recommendation): number {
  const h = parseHours(rec.weekly_time_saved)
  return Math.round(h * rec.match_score / 2.2)
}

function difficultyInfo(d: string): { label: string; pct: number; color: string } {
  if (d === 'easy') return { label: '新手', pct: 28, color: 'bg-purple-500' }
  if (d === 'medium') return { label: '需摸索', pct: 60, color: 'bg-purple-400' }
  return { label: '有门槛', pct: 88, color: 'bg-purple-300' }
}


const RANK_LABELS = ['最推荐', '备选', '进阶']
const RANK_BADGE_COLORS = [
  'text-cyan-300 border-cyan-500/50 bg-cyan-500/10',
  'text-purple-300 border-purple-500/40 bg-purple-500/10',
  'text-slate-400 border-slate-600/50 bg-slate-700/30',
]
const RANK_SCORE_COLORS = ['text-cyan-400', 'text-purple-400', 'text-slate-400']
const RANK_CARD_BORDERS = ['border-cyan-500/30', 'border-purple-500/20', 'border-slate-700/50']

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  const [activeComp, setActiveComp] = useState(2) // default: 工具
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const components = rec.agent_components ?? COMPONENT_LABELS.map((_, i) => ({
    name: ['知识库', '用户记忆', rec.platform, '智能路由', rec.platform][i],
    desc: ['存储文档和历史记录', '记住工作习惯', '实时处理任务', '自动分配任务路径', '核心推理引擎'][i],
    analogy: '',
  }))

  const dInfo = difficultyInfo(rec.difficulty)
  const hours = parseHours(rec.weekly_time_saved)
  const timePct = Math.min(95, hours * 11)
  const repPct = Math.round((rec.match_score - 50) * 1.9)

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 1600)
    })
  }

  const active = components[activeComp]

  return (
    <div className={`rounded-2xl border ${RANK_CARD_BORDERS[index]} bg-[#0c1729] overflow-hidden`}>

      {/* ── Header ── */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border tracking-wider uppercase ${RANK_BADGE_COLORS[index]}`}>
                RECOMMENDED
              </span>
              <span className="text-slate-500 text-xs">#{rec.rank}</span>
            </div>
            <h2 className="text-2xl font-bold text-white leading-tight">{rec.name}</h2>
            <p className="text-slate-400 text-sm leading-snug">{rec.tagline}</p>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <span className={`text-5xl font-black font-mono leading-none ${RANK_SCORE_COLORS[index]}`}>
              {rec.match_score}
            </span>
            <p className="text-slate-600 text-xs mt-0.5">分</p>
          </div>
        </div>
      </div>

      {/* ── 5 Component Boxes ── */}
      <div className="px-3 pb-3">
        <div className="grid grid-cols-5 gap-1.5">
          {COMPONENT_LABELS.map((label, i) => {
            const comp = components[i]
            const isActive = i === activeComp
            return (
              <button
                key={label}
                onClick={() => setActiveComp(i)}
                className={`flex flex-col items-center gap-1.5 rounded-xl p-2.5 transition-all border ${
                  isActive
                    ? 'bg-[#0e2240] border-cyan-400/60 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                    : 'bg-slate-800/40 border-slate-700/40 hover:border-slate-600'
                }`}
              >
                <div className="w-7 h-7 flex items-center justify-center opacity-90">
                  {COMPONENT_ICONS[i]}
                </div>
                <span className={`text-[11px] font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  {label}
                </span>
                <span className={`text-[10px] leading-tight text-center ${isActive ? 'text-cyan-400' : 'text-slate-600'}`}>
                  {comp?.name ?? '—'}
                </span>
              </button>
            )
          })}
        </div>

        {/* Detail panel for active component */}
        {active && (
          <div className="mt-2 rounded-xl bg-slate-900/50 border border-slate-700/40 px-4 py-3">
            <p className="text-white text-sm font-semibold mb-0.5">
              <span className="text-yellow-400 mr-1.5">☆</span>
              {active.name}
            </p>
            <p className="text-slate-300 text-xs mb-1">{active.desc}</p>
            {active.analogy && (
              <p className="text-slate-600 text-[11px]">{active.analogy}</p>
            )}
          </div>
        )}
      </div>

      <div className="h-px bg-slate-800/70 mx-3" />

      {/* ── 性能预测 ── */}
      <div className="p-5 pb-4">
        <p className="text-slate-300 text-sm font-semibold mb-4">
          <span className="text-cyan-400 mr-1.5">⚡</span>性能预测
        </p>
        <div className="space-y-3.5">
          {/* Time saved */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-400 text-xs flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                每周节省时间
              </span>
              <span className="text-emerald-400 text-sm font-bold">{rec.weekly_time_saved}</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${timePct}%` }} />
            </div>
          </div>
          {/* Repetition reduction */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-400 text-xs flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                重复任务减少
              </span>
              <span className="text-cyan-400 text-sm font-bold">{repPct}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-1000" style={{ width: `${repPct}%` }} />
            </div>
          </div>
          {/* Difficulty */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-400 text-xs">搭建难度</span>
              <span className="text-purple-400 text-sm font-bold">{dInfo.label}</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full ${dInfo.color} rounded-full transition-all duration-1000`} style={{ width: `${dInfo.pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-800/70 mx-3" />

      {/* ── 帮你做到 ── */}
      <div className="p-5 pb-4">
        <p className="text-slate-300 text-sm font-semibold mb-3">📋 它能帮你做到</p>
        <div className="space-y-2">
          {rec.what_it_does.map((item, i) => {
            const parts = item.split('→')
            return (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-emerald-400 text-xs flex-shrink-0 mt-0.5 font-bold">✓</span>
                <p className="text-slate-300 text-sm leading-snug">
                  {parts.length === 2 ? (
                    <>{parts[0].trim()}<span className="text-cyan-400 font-medium mx-1">→</span>{parts[1].trim()}</>
                  ) : item}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="h-px bg-slate-800/70 mx-3" />

      {/* ── 这样说话触发它 ── */}
      <div className="p-5 pb-4">
        <p className="text-slate-300 text-sm font-semibold mb-1">💬 这样说话触发它</p>
        <p className="text-slate-600 text-xs mb-3">可以直接复制粘贴</p>
        <div className="space-y-2">
          {rec.example_prompts.map((prompt, i) => {
            const k = `p-${rec.rank}-${i}`
            return (
              <div key={i} className="flex items-start gap-2 bg-slate-900/60 border border-slate-700/40 rounded-xl px-3.5 py-3">
                <p className="text-slate-300 text-sm leading-relaxed flex-1">{prompt}</p>
                <button onClick={() => copyText(prompt, k)} className="flex-shrink-0 text-slate-500 hover:text-cyan-400 transition-colors ml-2">
                  {copiedKey === k ? <span className="text-emerald-400 text-[11px] font-medium whitespace-nowrap">已复制!</span> : <span className="text-base">📋</span>}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="h-px bg-slate-800/70 mx-3" />

      {/* ── 3步用起来 ── */}
      <div className="p-5 pb-4">
        <p className="text-slate-300 text-sm font-semibold mb-3">🛠 3步用起来</p>
        <div className="space-y-3">
          {rec.setup_steps.map((step, i) => (
            <div key={i}>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-slate-300 text-sm leading-relaxed">{step}</p>
              </div>
              {i === 1 && (
                <div className="mt-2.5 ml-9 bg-slate-900/80 border border-slate-700/50 rounded-xl p-3.5">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-slate-500 text-xs">人设模板（复制粘贴到第 2 步的框里）</p>
                    <button onClick={() => copyText(rec.system_prompt_template, `tpl-${rec.rank}`)} className="flex-shrink-0 text-slate-500 hover:text-cyan-400 transition-colors">
                      {copiedKey === `tpl-${rec.rank}` ? <span className="text-emerald-400 text-[11px] font-medium">已复制!</span> : <span>📋</span>}
                    </button>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{rec.system_prompt_template}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-800/70 mx-3" />

      {/* ── Bottom: 限制 + 为什么适合 ── */}
      <div className="p-5">
        <div className="bg-amber-950/30 border border-amber-700/30 rounded-xl px-4 py-3 mb-3">
          <p className="text-amber-300 text-xs leading-relaxed">
            <span className="font-semibold">⚠ 做不到的事：</span>{rec.cant_do}
          </p>
        </div>
        <div className="bg-slate-900/40 rounded-xl px-4 py-3 border border-slate-800/50">
          <p className="text-slate-400 text-xs leading-relaxed">
            <span className="text-slate-300 font-medium">为什么适合你　</span>{rec.why_this}
          </p>
        </div>
      </div>
    </div>
  )
}

function ResultContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState(0)

  const job = params.get('job') || ''
  const tools = params.get('tools') || ''
  const system = params.get('system') || ''
  const need = params.get('need') || ''
  const level = params.get('level') || ''

  useEffect(() => {
    if (!job || !need || !level) { router.push('/'); return }

    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job, tools, system, need, level }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else if (data.recommendations) setRecommendations(data.recommendations)
        else setError('返回格式有点问题，刷新试试？')
      })
      .catch(() => setError('网络有点问题，刷新试试？'))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const primaryRec = recommendations[0]
  const efficiencyBoost = primaryRec ? calcEfficiencyBoost(primaryRec) : 0

  // Parse weekly hours saved into a readable number
  const weeklyHours = primaryRec ? parseHours(primaryRec.weekly_time_saved) : 0
  const parallelCount = primaryRec ? primaryRec.what_it_does.length : 3
  const difficultyMap = { easy: '极低', medium: '中等', hard: '有挑战' }
  const difficultyLabel = primaryRec ? (difficultyMap[primaryRec.difficulty] ?? '中等') : '中等'
  const difficultyColor = primaryRec?.difficulty === 'easy'
    ? 'text-emerald-400' : primaryRec?.difficulty === 'hard'
      ? 'text-amber-400' : 'text-cyan-400'

  if (loading) return <ScanningLoader />

  return (
    <main className="min-h-screen bg-[#060c18] pb-16">

      {/* ── BUILD COMPLETE header ── */}
      {recommendations.length > 0 && (
        <div className="pt-10 pb-6 px-4 max-w-xl mx-auto">
          <div className="text-center mb-6">
            <p className="font-mono text-xs tracking-[0.25em] text-cyan-500 mb-3">// BUILD COMPLETE</p>
            <h1 className="text-4xl font-black text-white mb-1 leading-tight">你的 Agent 已就绪</h1>
            <p className="text-slate-500 text-sm">基于你的工作场景，预估收益如下</p>
          </div>

          {/* 3-dimension benefit cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* Time */}
            <div className="bg-[#0c1729] border border-cyan-900/50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-cyan-400 tabular-nums leading-none">
                {weeklyHours}<span className="text-base">h</span>
              </div>
              <div className="text-slate-300 text-xs font-semibold mt-1.5">每周节省</div>
              <div className="text-slate-600 text-[10px] mt-1 leading-tight">
                从重复任务中<br />彻底解放
              </div>
            </div>

            {/* Difficulty */}
            <div className="bg-[#0c1729] border border-purple-900/50 rounded-2xl p-4 text-center">
              <div className={`text-2xl font-black ${difficultyColor} leading-none mt-1`}>
                {difficultyLabel}
              </div>
              <div className="text-slate-300 text-xs font-semibold mt-1.5">搭建难度</div>
              <div className="text-slate-600 text-[10px] mt-1 leading-tight">
                无需写代码<br />照步骤操作即可
              </div>
            </div>

            {/* Parallel */}
            <div className="bg-[#0c1729] border border-emerald-900/50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-emerald-400 leading-none">
                {parallelCount}<span className="text-base">条</span>
              </div>
              <div className="text-slate-300 text-xs font-semibold mt-1.5">并行工作线</div>
              <div className="text-slate-600 text-[10px] mt-1 leading-tight">
                多任务同时跑<br />不再一件件排队
              </div>
            </div>
          </div>

          {/* Overall efficiency strip */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-700/30 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-slate-400 text-sm">综合效率提升预估</span>
            <span className="text-emerald-400 font-black text-2xl tabular-nums">+{efficiencyBoost}%</span>
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto px-4">
        {/* Error */}
        {error && (
          <div className="bg-[#0c1729] border border-red-900/40 rounded-2xl p-8 text-center mt-10">
            <p className="text-red-400 mb-1 text-sm">{error}</p>
            <p className="text-slate-600 text-xs mb-5">可能是 API Key 没配好，或者网络抖了一下</p>
            <button onClick={() => router.push('/')} className="px-6 py-2.5 bg-cyan-500 text-slate-900 rounded-xl text-sm font-bold hover:bg-cyan-400 transition-all">
              重新来过
            </button>
          </div>
        )}

        {/* Tab switcher + cards */}
        {recommendations.length > 0 && (
          <div>
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {recommendations.map((rec, i) => (
                <button
                  key={rec.rank}
                  onClick={() => setActiveTab(i)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    i === activeTab
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-500 hover:text-slate-300 hover:border-slate-600'
                  }`}
                >
                  #{rec.rank} {RANK_LABELS[i]}
                </button>
              ))}
            </div>

            <RecommendationCard rec={recommendations[activeTab]} index={activeTab} />

            <button
              onClick={() => router.push('/')}
              className="w-full mt-4 py-3 rounded-xl bg-[#0c1729] border border-slate-700/60 text-slate-400 text-sm hover:text-white hover:border-slate-500 transition-all"
            >
              不满意？重新配 →
            </button>
          </div>
        )}

        <p className="text-center text-slate-700 text-xs pt-6 pb-4">结果由 AI 生成，仅供参考，建议结合实际试试</p>
      </div>
    </main>
  )
}

export default function ResultPage() {
  return (
    <Suspense>
      <ResultContent />
    </Suspense>
  )
}
