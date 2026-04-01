'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const JOBS = ['市场运营', '销售', '产品经理', '财务/会计', '行政/HR', '内容创作', '数据分析', '其他']
const TOOLS = ['Excel/WPS', '飞书', '钉钉', '微信', 'PowerPoint', '企业微信', '其他']
const SYSTEMS = [
  { value: 'windows', label: 'Windows', icon: '🪟', desc: '台式机 / 公司电脑' },
  { value: 'mac', label: 'Mac', icon: '🍎', desc: 'MacBook / iMac' },
  { value: 'both', label: '两个都用', icon: '💻', desc: '公司 Windows 家里 Mac' },
]
const LEVELS = [
  { value: 'beginner', label: '没用过 AI 工具', desc: '听说过 ChatGPT，但没怎么用过' },
  { value: 'intermediate', label: '偶尔用 Kimi / DeepSeek', desc: '会聊天，但不知道 Agent 是啥' },
  { value: 'advanced', label: '折腾过 API 或工作流', desc: '搭过简单的自动化，懂一点代码' },
]

// Step 1-3 = 职业/工具/系统, Step 4 = 聊天, Step 5 = 技术底子
const PROGRESS_STEPS = [
  { num: 1, label: '职业' },
  { num: 2, label: '常用工具' },
  { num: 3, label: '工作系统' },
  { num: 4, label: '工作烦恼' },
  { num: 5, label: '技术底子' },
]

const CHAT_SUGGESTIONS_BY_JOB: Record<string, string[]> = {
  '市场运营': ['写活动方案太费时', '每周要出数据报告', '回复私信评论量太大', '做 PPT 做到想哭'],
  '销售': ['每天写跟进记录很烦', '整理客户信息乱', '准备提案材料费时', '回复客户消息太多'],
  '产品经理': ['写需求文档很累', '整理用户反馈没效率', '开会后要自己记录', '竞品调研太花时间'],
  '财务/会计': ['每月整理账单很烦', '核对 Excel 数据出错', '写财务报告格式麻烦', '月报要反复改'],
  '行政/HR': ['写通知公告费时间', '整理员工档案很乱', '招聘材料每次重写', '回复入职问题重复'],
  '内容创作': ['每天找选题很难', '写稿改稿来回折腾', '资料整理没有系统', '脚本结构想不出来'],
  '数据分析': ['写分析报告很耗时', '数据整理反复手动做', '汇报材料每次从头', '结论提炼没思路'],
}
const DEFAULT_SUGGESTIONS = [
  '每天要写日报 / 周报，太费时间',
  '经常要整理 Excel，很烦',
  '回复消息 / 邮件量很大',
  '开会后要自己整理会议记录',
]

interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
  fileName?: string // display-only: file badge in bubble
}

const BEFORE_AFTER = [
  { icon: '⏱', before: '写日报/周报手打 30 分钟', after: '填关键信息，10 秒生成' },
  { icon: '📊', before: '整理 Excel 数据花 2 小时', after: '说清楚要求，即时输出' },
  { icon: '🔀', before: '多项任务一件件排队做', after: '3 条工作线同时在跑' },
]

function EfficiencyBanner() {
  const [timeVal, setTimeVal] = useState(0)
  const [repeatVal, setRepeatVal] = useState(0)

  useEffect(() => {
    let t = 0
    const ti = setInterval(() => { t++; setTimeVal(t); if (t >= 8) clearInterval(ti) }, 70)
    let r = 0
    const ri = setInterval(() => { r += 4; setRepeatVal(r); if (r >= 70) clearInterval(ri) }, 40)
    return () => { clearInterval(ti); clearInterval(ri) }
  }, [])

  return (
    <div className="w-full max-w-xl mb-5 space-y-2.5">
      {/* Before → After rows */}
      <div className="bg-[#0c1729] border border-slate-700/40 rounded-2xl px-4 py-3.5">
        <p className="text-slate-600 text-[10px] font-mono tracking-[0.2em] uppercase mb-3">定制化 Agent 改变什么</p>
        <div className="space-y-2">
          {BEFORE_AFTER.map((row) => (
            <div key={row.before} className="flex items-center gap-2.5 text-xs">
              <span className="text-base flex-shrink-0 w-5 text-center">{row.icon}</span>
              <span className="text-slate-600 line-through flex-1 min-w-0 truncate">{row.before}</span>
              <span className="text-slate-600 flex-shrink-0">→</span>
              <span className="text-emerald-400 font-medium flex-1 min-w-0 truncate">{row.after}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3 metric cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#0c1729] border border-cyan-900/50 rounded-xl p-3 text-center">
          <div className="text-xl font-black text-cyan-400 tabular-nums leading-none">
            {timeVal}<span className="text-xs">h+</span>
          </div>
          <div className="text-slate-300 text-[11px] font-medium mt-1">每周省出来</div>
          <div className="text-slate-600 text-[10px] mt-0.5">从重复劳动解放</div>
        </div>
        <div className="bg-[#0c1729] border border-emerald-900/50 rounded-xl p-3 text-center">
          <div className="text-xl font-black text-emerald-400 tabular-nums leading-none">
            {repeatVal}<span className="text-xs">%</span>
          </div>
          <div className="text-slate-300 text-[11px] font-medium mt-1">重复任务减少</div>
          <div className="text-slate-600 text-[10px] mt-0.5">AI 接手，你来决策</div>
        </div>
        <div className="bg-[#0c1729] border border-purple-900/50 rounded-xl p-3 text-center">
          <div className="text-xl font-black text-purple-400 leading-none">×3</div>
          <div className="text-slate-300 text-[11px] font-medium mt-1">并行工作能力</div>
          <div className="text-slate-600 text-[10px] mt-0.5">多条线同时推进</div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    job: '',
    tools: [] as string[],
    system: '',
    need: '',
    level: '',
  })
  const [otherJobInput, setOtherJobInput] = useState('')
  const [otherToolInput, setOtherToolInput] = useState('')

  // ── Chat state (step 4) ──────────────────────────────────────
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatStreaming, setChatStreaming] = useState(false)
  const [chatReady, setChatReady] = useState(false)
  const [attachedFile, setAttachedFile] = useState<{ name: string; content: string } | null>(null)
  const [showFileHint, setShowFileHint] = useState(true) // collapsible file-upload explainer
  const chatBottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleTool = (tool: string) =>
    setForm(f => ({
      ...f,
      tools: f.tools.includes(tool) ? f.tools.filter(t => t !== tool) : [...f.tools, tool],
    }))

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMsgs])

  // Trigger AI first message when entering step 4
  useEffect(() => {
    if (step === 4 && chatMsgs.length === 0) {
      streamAI([])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  // Show "继续" once AI replied ≥1 time AND user replied ≥1 time
  useEffect(() => {
    const aiCount = chatMsgs.filter(m => m.role === 'assistant').length
    const userCount = chatMsgs.filter(m => m.role === 'user').length
    if (aiCount >= 1 && userCount >= 1) setChatReady(true)
  }, [chatMsgs])

  const resolvedJob = form.job === '其他' ? (otherJobInput.trim() || '其他') : form.job
  const resolvedTools = [
    ...form.tools.filter(t => t !== '其他'),
    ...(form.tools.includes('其他') && otherToolInput.trim() ? [otherToolInput.trim()] : []),
  ]

  async function streamAI(history: ChatMsg[]) {
    setChatStreaming(true)
    setChatMsgs(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          job: resolvedJob,
          tools: resolvedTools.join(','),
          system: form.system,
        }),
      })

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        for (const line of decoder.decode(value).split('\n')) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6).trim()
          if (payload === '[DONE]') break
          try {
            const { text } = JSON.parse(payload)
            if (text) {
              setChatMsgs(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: updated[updated.length - 1].content + text,
                }
                return updated
              })
            }
          } catch { /* skip */ }
        }
      }
    } catch {
      setChatMsgs(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: '网络有点问题，刷新试试？' }
        return updated
      })
    } finally {
      setChatStreaming(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    const supported = ['txt', 'csv', 'md', 'json', 'tsv']
    if (!supported.includes(ext)) {
      alert('暂时只支持 .txt .csv .md .json 格式\n其他格式请把内容复制粘贴进来')
      return
    }
    if (file.size > 80 * 1024) {
      alert('文件太大，请上传 80KB 以内的文件')
      return
    }

    const reader = new FileReader()
    reader.onload = ev => {
      setAttachedFile({ name: file.name, content: ev.target?.result as string })
      setShowFileHint(false) // hide explainer after first upload
    }
    reader.readAsText(file, 'UTF-8')
  }

  async function handleChatSend() {
    const text = chatInput.trim()
    if ((!text && !attachedFile) || chatStreaming) return

    let apiContent = text
    let displayFileName: string | undefined
    if (attachedFile) {
      const preview = attachedFile.content.length > 3000
        ? attachedFile.content.slice(0, 3000) + '\n...(内容已截断)'
        : attachedFile.content
      apiContent = text
        ? `${text}\n\n[我上传了文件「${attachedFile.name}」供你参考：]\n\`\`\`\n${preview}\n\`\`\``
        : `[我上传了文件「${attachedFile.name}」，这是我平时工作用的模板，请参考这个文件格式和内容来了解我的工作方式：]\n\`\`\`\n${preview}\n\`\`\``
      displayFileName = attachedFile.name
      setAttachedFile(null)
    }

    const newHistory: ChatMsg[] = [...chatMsgs, { role: 'user', content: apiContent, fileName: displayFileName }]
    setChatMsgs(newHistory)
    setChatInput('')
    await streamAI(newHistory.map(m => ({ role: m.role, content: m.content })))
  }

  function handleChatContinue() {
    const transcript = chatMsgs
      .map(m => (m.role === 'user' ? `用户：${m.content}` : `顾问：${m.content}`))
      .join('\n')
    setForm(f => ({ ...f, need: transcript }))
    setStep(5)
  }

  const canNext = () => {
    if (step === 1) return form.job !== '' && (form.job !== '其他' || otherJobInput.trim() !== '')
    if (step === 2) return true // tools are optional
    if (step === 3) return form.system !== ''
    if (step === 4) return chatReady && !chatStreaming
    if (step === 5) return form.level !== ''
    return false
  }

  const handleSubmit = () => {
    const params = new URLSearchParams({
      job: resolvedJob,
      tools: resolvedTools.join(','),
      system: form.system,
      need: form.need,
      level: form.level,
    })
    router.push(`/result?${params.toString()}`)
  }

  const isChatStep = step === 4

  return (
    <main className="min-h-screen bg-[#060c18] flex flex-col items-center p-4 pb-16">

      {/* Header */}
      <div className="w-full max-w-xl pt-12 pb-8 text-center">
        <h1 className="text-[2.6rem] font-bold leading-tight tracking-tight mb-3">
          <span className="text-cyan-400">找到你真正</span>
          <span className="text-white">能用上的 AI</span>
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          回答几个问题，帮你从 5 大模块里挑最合适的组合。<br />
          <span className="text-slate-500 text-sm">不卖课、不推广告，就是给个老实建议。</span>
        </p>
      </div>

      {/* ── Efficiency banner — only on step 1 ── */}
      {step === 1 && <EfficiencyBanner />}

      {/* Progress bar — 5 steps */}
      <div className="w-full max-w-xl mb-8">
        <div className="flex items-start">
          {PROGRESS_STEPS.map((s, i) => {
            const done = s.num < step
            const active = s.num === step
            return (
              <div key={s.num} className="flex items-start flex-1 min-w-0">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2 ${
                    done
                      ? 'bg-cyan-500 border-cyan-500 text-slate-900'
                      : active
                        ? 'bg-transparent border-cyan-400 text-cyan-400'
                        : 'bg-transparent border-slate-700 text-slate-600'
                  }`}>
                    {done ? '✓' : s.num}
                  </div>
                  <span className={`mt-1.5 text-[10px] text-center leading-tight whitespace-nowrap transition-colors duration-300 ${
                    done ? 'text-cyan-500' : active ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {i < PROGRESS_STEPS.length - 1 && (
                  <div className="flex-1 mt-3.5 mx-1.5">
                    <div className={`h-px transition-all duration-500 ${s.num < step ? 'bg-cyan-500' : 'bg-slate-700'}`} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Card */}
      <div className={`w-full max-w-xl bg-[#0c1729] border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden ${isChatStep ? 'flex flex-col' : 'p-6'}`}>

        {/* ── STEP 1: 职业 ── */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-1">你是做什么的？</h2>
            <p className="text-slate-500 text-sm mb-5">不同职位的重复劳动差很多，选对了推荐才准</p>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {JOBS.map(job => (
                <button
                  key={job}
                  onClick={() => setForm(f => ({ ...f, job }))}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all border ${
                    form.job === job
                      ? 'bg-cyan-500/10 border-cyan-400/70 text-cyan-300'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  {job}
                </button>
              ))}
            </div>

            {form.job === '其他' && (
              <input
                autoFocus
                type="text"
                value={otherJobInput}
                onChange={e => setOtherJobInput(e.target.value)}
                placeholder="说说你做什么的，比如「法务」「设计师」"
                className="w-full bg-slate-900/60 border border-cyan-500/40 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-400/70 transition-colors"
              />
            )}
          </div>
        )}

        {/* ── STEP 2: 工具 ── */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-1">平时用哪些工具？</h2>
            <p className="text-slate-500 text-sm mb-5">
              可以不选，但选了推荐更准
              <span className="text-slate-600 ml-1">—— 告诉我你的工具，AI 方案才能真正接得上</span>
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {TOOLS.map(tool => (
                <button
                  key={tool}
                  onClick={() => toggleTool(tool)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                    form.tools.includes(tool)
                      ? 'bg-cyan-500/10 border-cyan-400/50 text-cyan-300'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  {tool}
                </button>
              ))}
            </div>

            {form.tools.includes('其他') && (
              <input
                autoFocus
                type="text"
                value={otherToolInput}
                onChange={e => setOtherToolInput(e.target.value)}
                placeholder="写出工具名，比如「Notion」「Slack」"
                className="w-full bg-slate-900/60 border border-cyan-500/40 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-400/70 transition-colors"
              />
            )}
          </div>
        )}

        {/* ── STEP 3: 系统 ── */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-1">用 Mac 还是 Windows？</h2>
            <p className="text-slate-500 text-sm mb-5">不同系统的安装方式和推荐工具不一样</p>

            <div className="grid grid-cols-3 gap-3">
              {SYSTEMS.map(sys => (
                <button
                  key={sys.value}
                  onClick={() => setForm(f => ({ ...f, system: sys.value }))}
                  className={`p-4 rounded-xl text-left transition-all border ${
                    form.system === sys.value
                      ? 'bg-cyan-500/10 border-cyan-400/70'
                      : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-500'
                  }`}
                >
                  <div className="text-2xl mb-2">{sys.icon}</div>
                  <div className={`text-sm font-semibold ${form.system === sys.value ? 'text-cyan-300' : 'text-white'}`}>{sys.label}</div>
                  <div className="text-slate-600 text-[10px] mt-1 leading-tight">{sys.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 4: CHAT ── */}
        {step === 4 && (
          <>
            {/* Chat header */}
            <div className="px-5 pt-5 pb-3 border-b border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-sm">🤖</div>
                <div>
                  <p className="text-white text-sm font-semibold">配置顾问</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 text-xs">在线</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-[260px] max-h-[360px]">
              {chatMsgs.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-100 rounded-br-sm'
                        : 'bg-slate-800/70 border border-slate-700/50 text-slate-200 rounded-bl-sm'
                    }`}
                  >
                    {msg.fileName && (
                      <div className="flex items-center gap-1.5 mb-1.5 text-cyan-400/80 text-xs">
                        <svg viewBox="0 0 16 16" className="w-3 h-3 flex-shrink-0" fill="none">
                          <path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M10 2v3h3" stroke="currentColor" strokeWidth="1.2"/>
                        </svg>
                        <span>{msg.fileName}</span>
                      </div>
                    )}
                    {msg.fileName && !msg.content.replace(/\[.*?\n```[\s\S]*?```/g, '').trim()
                      ? '已上传文件供参考'
                      : msg.content.replace(/\n\n\[我上传了文件[\s\S]*$/, '') || (
                          <span className="flex gap-1 items-center h-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0ms]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:150ms]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:300ms]" />
                          </span>
                        )
                    }
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick reply suggestions */}
            {!chatStreaming && chatInput === '' && chatMsgs.filter(m => m.role === 'user').length === 0 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {(CHAT_SUGGESTIONS_BY_JOB[resolvedJob] ?? DEFAULT_SUGGESTIONS).map((s: string) => (
                  <button
                    key={s}
                    onClick={() => { setChatInput(s); setTimeout(() => inputRef.current?.focus(), 50) }}
                    className="px-3 py-1 rounded-full text-xs border border-slate-700/60 bg-slate-800/50 text-slate-400 hover:border-cyan-500/40 hover:text-cyan-300 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input area */}
            <div className="px-4 py-3 border-t border-slate-800/60">

              {/* File upload explainer — shown until user uploads or dismisses */}
              {showFileHint && (
                <div className="flex items-start gap-2.5 mb-3 bg-slate-800/50 border border-slate-700/50 rounded-xl px-3.5 py-2.5">
                  <svg viewBox="0 0 20 20" className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" fill="none">
                    <path d="M17.5 10.5l-7.5 7.5a5 5 0 01-7.07-7.07l8.49-8.49a3 3 0 014.24 4.24l-8.5 8.5a1 1 0 01-1.41-1.42l7.5-7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 text-xs font-medium mb-0.5">可以上传你的工作文件</p>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      把平时用的 Excel 表格、周报模板、工作流程文档上传进来，顾问能更准确地了解你的工作方式，推荐更贴合的 AI 方案。支持 .txt .csv .md .json 格式。
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFileHint(false)}
                    className="text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0 text-base leading-none"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* File attachment preview chip */}
              {attachedFile && (
                <div className="flex items-center gap-2 mb-2 px-1">
                  <div className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-2.5 py-1 text-xs text-cyan-300 max-w-full overflow-hidden">
                    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 flex-shrink-0" fill="none">
                      <path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M10 2v3h3" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                    <span className="truncate">{attachedFile.name}</span>
                    <button
                      onClick={() => setAttachedFile(null)}
                      className="ml-1 text-cyan-500 hover:text-white flex-shrink-0 transition-colors"
                    >×</button>
                  </div>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.csv,.md,.json,.tsv"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="flex gap-2">
                {/* Paperclip button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={chatStreaming}
                  title="上传工作文件模板（.txt .csv .md .json）"
                  className="px-2.5 py-2.5 rounded-xl border border-slate-700/60 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/40 disabled:opacity-30 transition-all flex-shrink-0"
                >
                  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
                    <path d="M17.5 10.5l-7.5 7.5a5 5 0 01-7.07-7.07l8.49-8.49a3 3 0 014.24 4.24l-8.5 8.5a1 1 0 01-1.41-1.42l7.5-7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSend() } }}
                  disabled={chatStreaming}
                  placeholder={chatStreaming ? '等一下…' : attachedFile ? '补充说明（可直接发送）…' : '说说你的情况…'}
                  className="flex-1 bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 disabled:opacity-50 transition-colors"
                />
                <button
                  onClick={handleChatSend}
                  disabled={(!chatInput.trim() && !attachedFile) || chatStreaming}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-900 font-bold text-sm hover:bg-cyan-400 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                >
                  发
                </button>
              </div>

              {/* Continue button */}
              {chatReady && (
                <button
                  onClick={handleChatContinue}
                  disabled={chatStreaming}
                  className="w-full mt-2.5 py-2.5 rounded-xl bg-slate-700/60 border border-slate-600/50 text-slate-300 text-sm font-medium hover:bg-slate-700 hover:text-white disabled:opacity-30 transition-all"
                >
                  信息够了，继续 →
                </button>
              )}
            </div>

            {/* Back button */}
            <div className="px-4 pb-3">
              <button
                onClick={() => setStep(3)}
                className="text-slate-600 text-xs hover:text-slate-400 transition-colors"
              >
                ← 返回上一步
              </button>
            </div>
          </>
        )}

        {/* ── STEP 5: 技术底子 ── */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-1">你的技术底子怎么样？</h2>
            <p className="text-slate-500 text-sm mb-5">没有对错，只是帮我判断该推荐多复杂的方案</p>

            <div className="space-y-2.5">
              {LEVELS.map(lvl => (
                <button
                  key={lvl.value}
                  onClick={() => setForm(f => ({ ...f, level: lvl.value }))}
                  className={`w-full p-4 rounded-xl text-left transition-all border ${
                    form.level === lvl.value
                      ? 'bg-cyan-500/10 border-cyan-400/70'
                      : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-500'
                  }`}
                >
                  <div className={`font-semibold text-sm ${form.level === lvl.value ? 'text-cyan-300' : 'text-white'}`}>
                    {lvl.label}
                  </div>
                  <div className="text-slate-500 text-xs mt-1 leading-snug">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation — steps 1/2/3/5 (step 4 has its own) */}
        {!isChatStep && (
          <div className="flex gap-3 mt-6 pt-5 border-t border-slate-800/60">
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-700/60 text-slate-500 text-sm hover:text-slate-300 hover:border-slate-600 transition-all"
              >
                ← 上一步
              </button>
            )}
            {step < 5 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 text-slate-900 font-bold text-sm hover:bg-cyan-400 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              >
                继续 →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canNext()}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 text-slate-900 font-bold text-sm hover:bg-cyan-400 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              >
                帮我配 →
              </button>
            )}
          </div>
        )}
      </div>

      <p className="text-slate-700 text-xs mt-5">免费 · 大概 20 秒出结果 · 不需要注册</p>
    </main>
  )
}
