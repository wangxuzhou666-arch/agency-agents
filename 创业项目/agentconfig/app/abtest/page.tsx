'use client'

import { useState } from 'react'

interface ModelResult {
  model: string
  elapsed_ms?: number
  tokens?: { prompt: number; completion: number; total: number }
  first_rec?: {
    name: string
    tagline: string
    match_score: number
    platform: string
    why_this: string
    what_it_does: string[]
    example_prompts: string[]
  }
  error?: string
}

interface ABTestResult {
  chat: ModelResult
  reasoner: ModelResult
}

export default function ABTestPage() {
  const [form, setForm] = useState({
    job: '',
    need: '',
    system: 'windows',
    level: 'beginner',
    tools: '',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ABTestResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await fetch('/api/ab-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '请求失败')
      } else {
        setResult(data)
      }
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  const maxMs = result
    ? Math.max(result.chat.elapsed_ms ?? 0, result.reasoner.elapsed_ms ?? 0)
    : 0

  const inputCls =
    'w-full rounded-lg border border-slate-700/50 bg-[#0c1729] px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/60'

  return (
    <div className="min-h-screen bg-[#060c18] text-slate-100 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">DeepSeek 模型对比测试</h1>
          <p className="mt-1 text-sm text-slate-400">
            对比 deepseek-chat 和 deepseek-reasoner 的质量与速度
          </p>
        </div>

        {/* Form */}
        <div className="rounded-xl border border-slate-700/50 bg-[#0c1729] p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400">职业</label>
              <input
                type="text"
                className={inputCls}
                placeholder="例如：市场运营"
                value={form.job}
                onChange={e => setForm(f => ({ ...f, job: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">常用工具</label>
              <input
                type="text"
                className={inputCls}
                placeholder="例如：飞书、Excel（可选）"
                value={form.tools}
                onChange={e => setForm(f => ({ ...f, tools: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">主要需求</label>
            <textarea
              rows={3}
              className={inputCls + ' resize-none'}
              placeholder="例如：每天要写日报周报，很费时间"
              value={form.need}
              onChange={e => setForm(f => ({ ...f, need: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400">系统</label>
              <select
                className={inputCls}
                value={form.system}
                onChange={e => setForm(f => ({ ...f, system: e.target.value }))}
              >
                <option value="windows">Windows</option>
                <option value="mac">Mac</option>
                <option value="both">Windows + Mac 都用</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">技术水平</label>
              <select
                className={inputCls}
                value={form.level}
                onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
              >
                <option value="beginner">纯小白</option>
                <option value="intermediate">用过 ChatGPT</option>
                <option value="advanced">懂一点代码</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !form.job || !form.need}
            className="w-full rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            开始对比测试 →
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-slate-700/50 bg-[#0c1729] p-8 text-center space-y-3">
            <div className="flex justify-center">
              <svg
                className="h-8 w-8 animate-spin text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-200">正在同时调用两个模型...</p>
            <p className="text-xs text-slate-500">reasoner 模型可能需要 30–60 秒，请耐心等待</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-700/40 bg-red-950/30 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">

            {/* Timing comparison */}
            <div className="rounded-xl border border-slate-700/50 bg-[#0c1729] p-6 space-y-4">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                速度对比
              </h2>

              {/* deepseek-chat row */}
              <TimingRow
                label="deepseek-chat"
                result={result.chat}
                maxMs={maxMs}
                color="cyan"
              />

              {/* deepseek-reasoner row */}
              <TimingRow
                label="deepseek-reasoner"
                result={result.reasoner}
                maxMs={maxMs}
                color="purple"
              />
            </div>

            {/* Winner callout */}
            <WinnerCallout chat={result.chat} reasoner={result.reasoner} />

            {/* Quality comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QualityCard result={result.chat} color="cyan" />
              <QualityCard result={result.reasoner} color="purple" />
            </div>

            {/* Full JSON toggle */}
            <details className="rounded-xl border border-slate-700/50 bg-[#0c1729] overflow-hidden">
              <summary className="cursor-pointer px-5 py-3 text-xs font-medium text-slate-400 hover:text-slate-200 select-none">
                查看完整 JSON（开发者用）
              </summary>
              <pre className="overflow-x-auto px-5 pb-5 pt-2 text-xs text-slate-300 leading-relaxed">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>

          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                        */
/* ------------------------------------------------------------------ */

function TimingRow({
  label,
  result,
  maxMs,
  color,
}: {
  label: string
  result: ModelResult
  maxMs: number
  color: 'cyan' | 'purple'
}) {
  const barColor = color === 'cyan' ? 'bg-cyan-500' : 'bg-purple-500'
  const textColor = color === 'cyan' ? 'text-cyan-400' : 'text-purple-400'

  if (result.error) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className={`font-mono font-semibold ${textColor}`}>{label}</span>
          <span className="text-red-400">错误: {result.error}</span>
        </div>
      </div>
    )
  }

  const pct = maxMs > 0 ? ((result.elapsed_ms ?? 0) / maxMs) * 100 : 0

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className={`font-mono font-semibold ${textColor}`}>{label}</span>
        <div className="flex items-center gap-3 text-slate-400">
          <span>{((result.elapsed_ms ?? 0) / 1000).toFixed(1)}s</span>
          <span className="text-slate-600">|</span>
          <span>{result.tokens?.completion ?? 0} completion tokens</span>
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-800">
        <div
          className={`h-2 rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function WinnerCallout({ chat, reasoner }: { chat: ModelResult; reasoner: ModelResult }) {
  const chatMs = chat.elapsed_ms
  const reasonerMs = reasoner.elapsed_ms

  let fasterMsg = ''
  if (chatMs != null && reasonerMs != null) {
    if (chatMs < reasonerMs) {
      fasterMsg = `deepseek-chat 快了 ${((reasonerMs - chatMs) / 1000).toFixed(1)}s`
    } else if (reasonerMs < chatMs) {
      fasterMsg = `deepseek-reasoner 快了 ${((chatMs - reasonerMs) / 1000).toFixed(1)}s`
    } else {
      fasterMsg = '两者速度相同'
    }
  }

  const chatTokens = chat.tokens?.completion ?? 0
  const reasonerTokens = reasoner.tokens?.completion ?? 0
  let tokenMsg = ''
  if (chatTokens > 0 || reasonerTokens > 0) {
    if (reasonerTokens > chatTokens) {
      tokenMsg = `deepseek-reasoner 多用了 ${reasonerTokens - chatTokens} completion tokens`
    } else if (chatTokens > reasonerTokens) {
      tokenMsg = `deepseek-chat 多用了 ${chatTokens - reasonerTokens} completion tokens`
    } else {
      tokenMsg = 'completion tokens 用量相同'
    }
  }

  if (!fasterMsg && !tokenMsg) return null

  return (
    <div className="rounded-xl border border-slate-700/50 bg-[#0c1729] px-5 py-4 text-sm space-y-1">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">结论</p>
      {fasterMsg && (
        <p className="text-slate-200">
          <span className="text-yellow-400">速度：</span> {fasterMsg}
        </p>
      )}
      {tokenMsg && (
        <p className="text-slate-200">
          <span className="text-yellow-400">Token：</span> {tokenMsg}
        </p>
      )}
    </div>
  )
}

function QualityCard({ result, color }: { result: ModelResult; color: 'cyan' | 'purple' }) {
  const badgeCls =
    color === 'cyan'
      ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-700/50'
      : 'bg-purple-900/60 text-purple-300 border border-purple-700/50'

  return (
    <div className="rounded-xl border border-slate-700/50 bg-[#0c1729] p-5 space-y-4">
      <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${badgeCls}`}>
        {result.model}
      </span>

      {result.error ? (
        <p className="text-sm text-red-400">错误: {result.error}</p>
      ) : result.first_rec ? (
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-white">{result.first_rec.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{result.first_rec.tagline}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">为什么推荐</p>
            <p className="text-slate-300 text-xs leading-relaxed">{result.first_rec.why_this}</p>
          </div>
          {result.first_rec.what_it_does.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">典型用法</p>
              <p className="text-slate-300 text-xs leading-relaxed">
                {result.first_rec.what_it_does[0]}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-500">无数据</p>
      )}
    </div>
  )
}
