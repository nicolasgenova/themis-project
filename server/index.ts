import 'dotenv/config'
import app from './app.js'

const port = Number(process.env.PORT || 3001)

app.listen(port, () => {
  console.log(`Backend do Oráculo de Themis em http://localhost:${port}`)
  if (!process.env.OPENAI_API_KEY) console.warn('OPENAI_API_KEY não configurada; será usada a explicação local.')
})
