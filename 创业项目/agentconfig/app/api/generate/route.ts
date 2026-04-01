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
9. agent_components 必须是5个，顺序固定为[上下文, 记忆, 工具, 路由, 大模型]，name/desc/analogy 必须结合用户职业和该方案的具体能力来写，不要泛泛而谈；第5个的name直接填平台名称（如"DeepSeek"、"Kimi"）

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
      "why_this": "针对用户具体情况写2句话：为什么这个平台适合他，为什么这个方案能解决他的问题",
      "agent_components": [
        {"name": "文档知识库", "desc": "存储行业文档和历史记录", "analogy": "类比：书架 - 随时取出需要的参考资料"},
        {"name": "用户画像", "desc": "记住工作习惯和偏好设置", "analogy": "类比：贴身助理 - 了解你的一切习惯"},
        {"name": "网络搜索", "desc": "实时获取最新信息", "analogy": "类比：网卡 - 联网获取实时数据"},
        {"name": "条件路由", "desc": "根据任务自动选择处理路径", "analogy": "类比：交通指挥 - 让不同任务走对路"},
        {"name": "平台名称", "desc": "驱动整个Agent思考推理", "analogy": "类比：CPU - 所有智能决策的核心"}
      ]
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
      "why_this": "...",
      "agent_components": [
        {"name": "...", "desc": "...", "analogy": "..."},
        {"name": "...", "desc": "...", "analogy": "..."},
        {"name": "...", "desc": "...", "analogy": "..."},
        {"name": "...", "desc": "...", "analogy": "..."},
        {"name": "...", "desc": "...", "analogy": "..."}
      ]
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
      "why_this": "...",
      "agent_components": [
        {"name": "...", "desc": "...", "analogy": "..."},
        {"name": "...", "desc": "...", "analogy": "..."},
        {"name": "...", "desc": "...", "analogy": "..."},
        {"name": "...", "desc": "...", "analogy": "..."},
        {"name": "...", "desc": "...", "analogy": "..."}
      ]
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

export async function POST(req: NextRequest) {
  const { job, tools, system, need, level } = await req.json()

  if (!job || !need || !level) {
    return NextResponse.json({ error: '参数缺失' }, { status: 400 })
  }

  const prompt = buildPrompt(job, tools, system, need, level)
  const claudeKey = process.env.ANTHROPIC_API_KEY
  const deepseekKey = process.env.DEEPSEEK_API_KEY

  try {
    let rawText = ''

    if (claudeKey) {
      const { Anthropic } = await import('@anthropic-ai/sdk')
      const client = new Anthropic({ apiKey: claudeKey })
      const message = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      })
      rawText = (message.content[0] as { type: string; text: string }).text

    } else if (deepseekKey) {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepseekKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4000,
        }),
      })
      const data = await response.json()
      rawText = data.choices[0].message.content

    } else {
      return NextResponse.json({ error: '未配置 API Key，请在 .env.local 中添加 ANTHROPIC_API_KEY 或 DEEPSEEK_API_KEY' }, { status: 500 })
    }

    const parsed = parseJSON(rawText)
    return NextResponse.json({ recommendations: parsed.recommendations })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'API 调用失败，请检查 Key 是否正确' }, { status: 500 })
  }
}
