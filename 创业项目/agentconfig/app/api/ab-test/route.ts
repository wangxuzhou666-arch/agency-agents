import { NextRequest, NextResponse } from 'next/server'

const LEVEL_MAP: Record<string, string> = {
  beginner: '纯小白（从没用过 ChatGPT）',
  intermediate: '用过 ChatGPT（会用网页版，没接触过 Agent）',
  advanced: '懂一点代码（会用 API 或写过简单脚本）',
}

const SYSTEM_MAP: Record<string, string> = {
  windows: 'Windows',
  mac: 'Mac',
  both: 'Windows + Mac 都用',
}

function buildPrompt(job: string, tools: string, system: string, need: string, level: string) {
  return `你是一位专业的 AI 工具顾问，帮助完全不懂技术的普通用户（小白）找到最适合他们的 AI Agent 方案。

用户信息：
- 职业/岗位：${job}
- 操作系统：${SYSTEM_MAP[system] || '未填写'}
- 常用工具：${tools || '未填写'}
- 想解决的问题：${need}
- 技术水平：${LEVEL_MAP[level] || level}

请为用户推荐3个最适合的 AI Agent 方案。每个方案必须是完全可操作的、具体的、针对该用户实际工作场景定制的。

重要规则：
1. what_it_does：每条必须是"用户给什么 → Agent产出什么"的格式，必须结合用户的实际职业和工具，不要泛泛而谈
2. example_prompts：必须是用户可以直接复制粘贴的完整句子，用第一人称，结合用户具体职业和场景，用[中括号]标注需要替换的部分
3. system_prompt_template：用户可以直接粘贴进 Bot 设置页面的2-3句话，结合用户职业定制
4. setup_steps：恰好3步，第1步必须包含平台完整网址（如 coze.cn），步骤要超级具体、手把手
5. cant_do：必须是新手最容易踩到的那个坑，用大白话说
6. platform：只能从这4个里选：Coze扣子、Kimi、DeepSeek、通义千问
7. rank 1 的 difficulty 必须是 "easy"，rank 3 可以是 "medium"
8. match_score：rank 1 必须在 90-95 之间，rank 2 在 80-89 之间，rank 3 在 70-82 之间

请严格以JSON格式返回，不要有任何多余文字、不要有markdown代码块标记：
{
  "recommendations": [
    {
      "rank": 1,
      "name": "方案名（3-5字，像产品名）",
      "tagline": "你做XX → 它帮你变成YY（具体说输入和输出是什么，结合用户职业）",
      "match_score": 92,
      "platform": "Coze扣子",
      "difficulty": "easy",
      "setup_time": "15分钟",
      "weekly_time_saved": "3小时",
      "what_it_does": [
        "你粘贴今天的工作记录 → 它自动格式化成标准日报发给你",
        "你上传一份Excel数据 → 它提取关键数字写成一段可以直接发领导的汇报",
        "你说一个客户的投诉内容 → 它给出3种不同风格的回复话术"
      ],
      "example_prompts": [
        "我是[用户职业]，今天完成了[事项]，遇到了[问题]，明天要[计划]，帮我写成可以直接发给领导的日报",
        "帮我把这段内容整理成正式格式，直接可以发出去：[粘贴你的内容]",
        "我现在遇到[具体问题]，帮我想3个解决办法，用简单的话说"
      ],
      "system_prompt_template": "你是一个专业的[职业]工作助手。帮我处理日常文案、数据整理和信息提取。回答要简洁、专业、直接可用，不要废话，不要解释你在做什么，直接给结果。",
      "setup_steps": [
        "打开 coze.cn，右上角点「登录」，选「微信扫码」免费注册，30秒搞定",
        "点左上角「创建Bot」→ 名字随便填比如「我的工作助手」→ 把下面「复制人设」那段话完整粘贴到「人设与回复逻辑」输入框里 → 点右上角「保存」",
        "点右上角「发布」→ 勾选「网页」→ 点「发布」→ 以后直接在这个页面对话就行，手机电脑都能用"
      ],
      "cant_do": "没法自动从飞书/钉钉拉取数据，还是需要你自己把内容复制过来粘贴给它",
      "why_this": "针对用户具体情况写2句话：为什么这个平台适合他，为什么这个方案能解决他的问题"
    },
    {
      "rank": 2,
      "name": "...",
      "tagline": "...",
      "match_score": 85,
      "platform": "Kimi",
      "difficulty": "easy",
      "setup_time": "10分钟",
      "weekly_time_saved": "2小时",
      "what_it_does": ["...", "...", "..."],
      "example_prompts": ["...", "...", "..."],
      "system_prompt_template": "...",
      "setup_steps": ["打开 kimi.moonshot.cn ...", "...", "..."],
      "cant_do": "...",
      "why_this": "..."
    },
    {
      "rank": 3,
      "name": "...",
      "tagline": "...",
      "match_score": 78,
      "platform": "DeepSeek",
      "difficulty": "medium",
      "setup_time": "20分钟",
      "weekly_time_saved": "4小时",
      "what_it_does": ["...", "...", "..."],
      "example_prompts": ["...", "...", "..."],
      "system_prompt_template": "...",
      "setup_steps": ["打开 chat.deepseek.com ...", "...", "..."],
      "cant_do": "...",
      "why_this": "..."
    }
  ]
}`
}

function parseJSON(text: string) {
  const cleaned = text
    .replace(/^```json\s*/m, '')
    .replace(/^```\s*/m, '')
    .replace(/```\s*$/m, '')
    .trim()
  return JSON.parse(cleaned)
}

async function callDeepSeek(model: string, prompt: string, apiKey: string) {
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4000,
    }),
  })
  const data = await response.json()
  return data
}

export async function POST(req: NextRequest) {
  const { job, tools, system, need, level } = await req.json()

  const deepseekKey = process.env.DEEPSEEK_API_KEY
  if (!deepseekKey) {
    return NextResponse.json({ error: 'DEEPSEEK_API_KEY not set' }, { status: 500 })
  }

  if (!job || !need || !level) {
    return NextResponse.json({ error: '参数缺失' }, { status: 400 })
  }

  const prompt = buildPrompt(job, tools, system, need, level)

  const [chatResult, reasonerResult] = await Promise.allSettled([
    (async () => {
      const start = Date.now()
      const data = await callDeepSeek('deepseek-chat', prompt, deepseekKey)
      const elapsed_ms = Date.now() - start
      const rawText = data.choices[0].message.content
      const parsed = parseJSON(rawText)
      const first_rec = parsed.recommendations?.[0] ?? null
      return {
        model: 'deepseek-chat',
        elapsed_ms,
        tokens: {
          prompt: data.usage?.prompt_tokens ?? 0,
          completion: data.usage?.completion_tokens ?? 0,
          total: data.usage?.total_tokens ?? 0,
        },
        first_rec,
      }
    })(),
    (async () => {
      const start = Date.now()
      const data = await callDeepSeek('deepseek-reasoner', prompt, deepseekKey)
      const elapsed_ms = Date.now() - start
      const rawText = data.choices[0].message.content
      const parsed = parseJSON(rawText)
      const first_rec = parsed.recommendations?.[0] ?? null
      return {
        model: 'deepseek-reasoner',
        elapsed_ms,
        tokens: {
          prompt: data.usage?.prompt_tokens ?? 0,
          completion: data.usage?.completion_tokens ?? 0,
          total: data.usage?.total_tokens ?? 0,
        },
        first_rec,
      }
    })(),
  ])

  const chat =
    chatResult.status === 'fulfilled'
      ? chatResult.value
      : { model: 'deepseek-chat', error: String((chatResult as PromiseRejectedResult).reason) }

  const reasoner =
    reasonerResult.status === 'fulfilled'
      ? reasonerResult.value
      : { model: 'deepseek-reasoner', error: String((reasonerResult as PromiseRejectedResult).reason) }

  return NextResponse.json({ chat, reasoner })
}
