import cors from 'cors'
import express from 'express'
import OpenAI from 'openai'

const app = express()
const allowedOrigin = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173')

app.disable('x-powered-by')
if (allowedOrigin) app.use(cors({ origin: allowedOrigin, methods: ['GET', 'POST'] }))
app.use(express.json({ limit: '20kb' }))

// Proteção básica. Em ambiente serverless, cada instância mantém seu próprio contador.
const requestsByIp = new Map<string, { count: number; resetAt: number }>()
app.use('/api', (request, response, next) => {
  const now = Date.now()
  const ip = request.ip || 'unknown'
  const current = requestsByIp.get(ip)
  const bucket = !current || current.resetAt <= now ? { count: 0, resetAt: now + 60_000 } : current
  bucket.count += 1
  requestsByIp.set(ip, bucket)
  if (bucket.count > 15) return response.status(429).json({ erro: 'Muitas solicitações. Aguarde um minuto e tente novamente.' })
  next()
})

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', openaiConfigured: Boolean(process.env.OPENAI_API_KEY) })
})

type ExplanationBody = {
  title?: unknown
  value?: unknown
  context?: unknown
  question?: unknown
}

function text(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function safeContext(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const entries = Object.entries(value).slice(0, 30).map(([key, field]) => [key.slice(0, 80), text(field, 1500)])
  return Object.fromEntries(entries)
}

app.post('/api/explicar', async (request, response) => {
  const body = request.body as ExplanationBody
  const context = safeContext(body.context)
  if (!context) return response.status(400).json({ erro: 'O contexto do dado não foi enviado corretamente.' })
  if (!process.env.OPENAI_API_KEY) return response.status(503).json({ erro: 'A explicação por IA ainda não foi configurada.' })

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const result = await openai.responses.create({
      prompt: {
        id: process.env.OPENAI_PROMPT_ID || 'pmpt_6a563946eb408190bec26211c9f126b8002a0aea30ec7ce2',
        version: process.env.OPENAI_PROMPT_VERSION || '2',
      },
      input: JSON.stringify({
        itemSelecionado: text(body.title, 200),
        valorExibido: text(body.value, 500),
        perguntaDoUsuario: text(body.question, 500),
        dadosOriginaisDoPortal: context,
      }),
    })
    const explanation = result.output_text.trim()
    if (!explanation) throw new Error('A API retornou uma resposta vazia.')
    return response.json({ explicacao: explanation })
  } catch (error) {
    console.error('Falha ao gerar explicação:', error instanceof Error ? error.message : error)
    return response.status(502).json({ erro: 'Não foi possível gerar a explicação agora.' })
  }
})

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  void _next
  console.error('Erro não tratado na API:', error)
  response.status(500).json({ erro: 'O servidor não conseguiu processar a solicitação.' })
})

export default app
