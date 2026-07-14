export type PublicRecord = {
  id: string
  title: string
  description: string
  biddingNumber: string
  noticeNumber: string
  processNumber: string
  publishedAt: string
  eventAt: string
  modality: string
  status: string
  estimatedValue: number | null
  approvedValue: number | null
  updatedAt: string
  source: Record<string, string>
}

const fieldAliases: Record<string, keyof Omit<PublicRecord, 'id' | 'source'>> = {
  titulo: 'title', descricao: 'description', numerolicitacao: 'biddingNumber', nlicitacao: 'biddingNumber',
  numeroedital: 'noticeNumber', nedital: 'noticeNumber', numeroprocesso: 'processNumber', nprocesso: 'processNumber',
  postagem: 'publishedAt', publicacao: 'publishedAt', realizacao: 'eventAt', modalidade: 'modality',
  situacao: 'status', status: 'status', valorestimado: 'estimatedValue', valorhomologado: 'approvedValue',
  dataatualizacao: 'updatedAt', atualizacao: 'updatedAt',
}

function key(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/n[º°]/gi, 'numero').replace(/[^a-z0-9]/gi, '').toLowerCase()
}

function parseRows(csv: string, delimiter = ';') {
  const rows: string[][] = []
  let row: string[] = [], value = '', quoted = false
  for (let i = 0; i < csv.length; i += 1) {
    const char = csv[i]
    if (char === '"' && quoted && csv[i + 1] === '"') { value += '"'; i += 1 }
    else if (char === '"') quoted = !quoted
    else if (char === delimiter && !quoted) { row.push(value.trim()); value = '' }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && csv[i + 1] === '\n') i += 1
      row.push(value.trim()); value = ''
      if (row.some(Boolean)) rows.push(row)
      row = []
    } else value += char
  }
  if (value || row.length) { row.push(value.trim()); rows.push(row) }
  return rows
}

function money(value = ''): number | null {
  if (!value.trim()) return null
  const parsed = Number(value.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : null
}

export function normalizeTransparencyCsv(csv: string): PublicRecord[] {
  const [rawHeaders = [], ...physicalRows] = parseRows(csv.replace(/^\uFEFF/, ''))
  const headers = rawHeaders.map((header) => header.trim())
  const rows: string[][] = []
  let pending: string[] = []
  physicalRows.forEach((row) => {
    if (!pending.length) pending = [...row]
    else {
      const last = pending.length - 1
      pending[last] = `${pending[last]} ${row[0] ?? ''}`.replace(/\s+/g, ' ').trim()
      pending.push(...row.slice(1))
    }
    if (pending.length >= headers.length) {
      rows.push(pending)
      pending = []
    }
  })
  if (pending.some(Boolean)) rows.push(pending)
  return rows.map((values, index) => {
    const source = Object.fromEntries(headers.filter(Boolean).map((header, column) => [header, values[column] ?? '']))
    const normalized: Partial<PublicRecord> = {}
    headers.forEach((header, column) => {
      const field = fieldAliases[key(header)]
      if (!field) return
      const value = values[column] ?? ''
      if (field === 'estimatedValue' || field === 'approvedValue') normalized[field] = money(value)
      else normalized[field] = value
    })
    return {
      id: `${normalized.processNumber || normalized.biddingNumber || 'registro'}-${index}`,
      title: normalized.title ?? 'Registro sem título', description: normalized.description ?? '',
      biddingNumber: normalized.biddingNumber ?? '', noticeNumber: normalized.noticeNumber ?? '',
      processNumber: normalized.processNumber ?? '', publishedAt: normalized.publishedAt ?? '',
      eventAt: normalized.eventAt ?? '', modality: normalized.modality ?? 'Não informada',
      status: normalized.status ?? 'Não informada', estimatedValue: normalized.estimatedValue ?? null,
      approvedValue: normalized.approvedValue ?? null, updatedAt: normalized.updatedAt ?? '', source,
    }
  })
}

export const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

// A fonte continua preservada em `source`; estas funções alteram apenas o texto exibido.
export function friendlyModality(value: string) {
  const normalized = key(value)
  if (normalized.includes('pregao')) return 'Pregão (disputa de preços)'
  if (normalized.includes('dispensa')) return 'Compra direta permitida por lei'
  if (normalized.includes('inexigibilidade')) return 'Contratação sem possibilidade de disputa'
  if (normalized.includes('concorrencia')) return 'Concorrência entre empresas'
  if (normalized.includes('chamamento')) return 'Seleção de organizações parceiras'
  if (normalized.includes('chamada')) return 'Chamada de fornecedores'
  if (normalized.includes('carona')) return 'Uso de compra feita por outro órgão'
  return value || 'Forma de contratação não informada'
}

export function friendlyStatus(value: string) {
  const normalized = key(value)
  if (normalized.includes('aberto')) return 'Em andamento'
  if (normalized.includes('conclu')) return 'Processo finalizado'
  if (normalized.includes('cancel')) return 'Cancelado'
  if (normalized.includes('suspens')) return 'Temporariamente suspenso'
  return value || 'Andamento não informado'
}

function sentenceCase(value: string) {
  const text = value.replace(/\s+/g, ' ').trim().toLocaleLowerCase('pt-BR')
  return text ? text.charAt(0).toLocaleUpperCase('pt-BR') + text.slice(1) : ''
}

export function friendlyPurpose(record: PublicRecord) {
  const source = record.description || record.title
  const withoutBoilerplate = source.replace(/^(contrata[cç][aã]o de empresa (especializada )?para|aquisi[cç][aã]o (futura e parcelada )?de|aquisi[cç][oõ]es futuras e parceladas de|permiss[aã]o de uso onerosa de)\s+/i, '')
  return sentenceCase(withoutBoilerplate) || 'Objetivo da contratação não informado.'
}
