import { NextRequest } from 'next/server'

const JOB_PAIN_POINTS: Record<string, string> = {
  '市场运营': '写文案、做活动方案、整理数据报告、回复私信评论',
  '销售': '写跟进记录、整理客户信息、准备提案、回复客户消息',
  '产品经理': '写需求文档、整理用户反馈、写会议纪要、做竞品分析',
  '财务/会计': '整理账单数据、写财务报告、核对Excel、准备月报',
  '行政/HR': '写通知公告、整理员工信息、准备招聘材料、回复入职问题',
  '内容创作': '写文章/脚本、找选题、做资料整理、改稿润色',
  '数据分析': '写分析报告、整理数据、做可视化说明、准备汇报材料',
}

function buildSystemPrompt(job: string, tools: string, system: string) {
  const painPoints = JOB_PAIN_POINTS[job] || '日常工作中的重复性任务'
  const toolsText = tools ? `常用 ${tools}` : '工具未填写'
  const osText = system === 'mac' ? 'Mac' : system === 'windows' ? 'Windows' : system === 'both' ? 'Windows 和 Mac 都用' : ''

  return `你是一个帮用户配置 AI Agent 的顾问，正在通过对话找出用户最值得自动化的那个痛点。

【已知用户信息 - 不要再问这些】
- 职位：${job}
- 常用工具：${toolsText}${osText ? `\n- 操作系统：${osText}` : ''}
- 这个职位常见的重复劳动：${painPoints}

【你的任务】
针对这个具体职位，找出用户花时间最多、最烦的那一件具体的事。

【严格规则】
1. 职位和工具已知，绝对不要再问"你是做什么的"或"你用什么工具"
2. 第一句话直接基于职位猜一个最可能的痛点，问用户是不是这个问题（给他确认或纠正的机会）
3. 根据回答追问一个细节：多久一次？卡在哪一步？现在怎么处理的？
4. 最多 2-3 轮对话，搞清楚后说：「好，信息够了，点下面「继续」按钮给你出方案。」
5. 每次回复 ≤ 50 字，越短越好，像发微信一样自然
6. 每次只问一个问题`
}

export async function POST(req: NextRequest) {
  const { messages, job, tools, system } = await req.json()

  const claudeKey = process.env.ANTHROPIC_API_KEY
  const deepseekKey = process.env.DEEPSEEK_API_KEY
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (text: string) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))

      try {
        if (claudeKey) {
          const { Anthropic } = await import('@anthropic-ai/sdk')
          const client = new Anthropic({ apiKey: claudeKey })

          const anthropicStream = client.messages.stream({
            model: 'claude-sonnet-4-6',
            max_tokens: 300,
            system: buildSystemPrompt(job, tools, system),
            messages,
          })

          for await (const chunk of anthropicStream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              send(chunk.delta.text)
            }
          }

        } else if (deepseekKey) {
          const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${deepseekKey}`,
            },
            body: JSON.stringify({
              model: 'deepseek-chat',
              messages: [
                { role: 'system', content: buildSystemPrompt(job, tools, system) },
                ...messages,
              ],
              max_tokens: 300,
              stream: true,
            }),
          })

          const reader = response.body!.getReader()
          const decoder = new TextDecoder()

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            for (const line of decoder.decode(value).split('\n')) {
              if (!line.startsWith('data: ')) continue
              const payload = line.slice(6).trim()
              if (payload === '[DONE]') continue
              try {
                const text = JSON.parse(payload).choices?.[0]?.delta?.content
                if (text) send(text)
              } catch { /* skip malformed chunks */ }
            }
          }

        } else {
          send('没有找到 API Key，请在 .env.local 里添加 ANTHROPIC_API_KEY 或 DEEPSEEK_API_KEY')
        }

      } catch (err) {
        console.error('[chat]', err)
        send('出了点问题，刷新试试？')
      } finally {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
