export type ExpenseRecord = {
  id: string
  commitmentNumber: string
  date: string
  document: string
  supplier: string
  budgetUnit: string
  executingUnit: string
  program: string
  modality: string
  legalBasis: string
  process: string
  functionName: string
  subfunction: string
  purpose: string
  committed: number
  cancelled: number
  liquidated: number
  paid: number
  balance: number
  source: Record<string, string>
}

function normalizedKey(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[°º]/g, '').replace(/[^a-z0-9]/gi, '').toLowerCase()
}

function parseLine(line: string) {
  const fields: string[] = []
  let value = '', quoted = false
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    if (char === '"' && quoted && line[index + 1] === '"') { value += '"'; index += 1 }
    else if (char === '"') quoted = !quoted
    else if (char === ';' && !quoted) { fields.push(value.trim()); value = '' }
    else value += char
  }
  fields.push(value.trim())
  return fields
}

function parseMoney(value = '') {
  const clean = value.trim().replace(/[^\d,.-]/g, '')
  if (!clean) return 0
  const decimalComma = clean.lastIndexOf(',') > clean.lastIndexOf('.')
  const parsed = Number(decimalComma ? clean.replace(/\./g, '').replace(',', '.') : clean.replace(/,/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

function cleanDate(value: string) {
  const compact = value.trim()
  if (/^\d{8}$/.test(compact)) return `${compact.slice(0, 2)}/${compact.slice(2, 4)}/${compact.slice(4)}`
  return compact.split(' ')[0] || 'Não informada'
}

function valueOf(source: Record<string, string>, aliases: string[]) {
  const entry = Object.entries(source).find(([header]) => aliases.includes(normalizedKey(header)))
  return entry?.[1]?.trim() ?? ''
}

export function normalizeExpensesCsv(csv: string): ExpenseRecord[] {
  const lines = csv.replace(/^\uFEFF/, '').split(/\r?\n/).filter((line) => line.trim())
  const headerIndex = lines.findIndex((line) => {
    const key = normalizedKey(line)
    return key.includes('empenho') && (key.includes('fornecedor') || key.includes('cpfcnpj'))
  })
  if (headerIndex < 0) return []
  const headers = parseLine(lines[headerIndex])
  return lines.slice(headerIndex + 1).map(parseLine).filter((fields) => fields.some(Boolean)).map((fields, index) => {
    const source = Object.fromEntries(headers.filter(Boolean).map((header, column) => [header.trim(), fields[column] ?? '']))
    const movementType = valueOf(source, ['tipodoempenho'])
    const rawCommitted = parseMoney(valueOf(source, ['empenhado', 'valorempenhado']))
    const isCancellation = rawCommitted < 0 || normalizedKey(movementType).includes('anulacao')
    const committed = isCancellation ? 0 : rawCommitted
    const cancelled = parseMoney(valueOf(source, ['anulado'])) || (isCancellation ? Math.abs(rawCommitted) : 0)
    const liquidated = parseMoney(valueOf(source, ['liquidado', 'valorliquidado']))
    const paid = parseMoney(valueOf(source, ['pago', 'valorpago']))
    const informedBalance = valueOf(source, ['saldo'])
    const balance = informedBalance ? parseMoney(informedBalance) : committed - cancelled - paid
    const commitmentNumber = valueOf(source, ['empenho', 'nempenho'])
    return {
      id: `${commitmentNumber || 'despesa'}-${index}`,
      commitmentNumber: commitmentNumber || 'Não informado',
      date: cleanDate(valueOf(source, ['dataemissao', 'datamovimentodoempenho'])),
      document: valueOf(source, ['cpfcnpj', 'cnpj']),
      supplier: valueOf(source, ['fornecedor', 'nomefornecedor']) || 'Não informado',
      budgetUnit: valueOf(source, ['unidadeorcamentaria', 'unidadegestora']) || 'Não informada',
      executingUnit: valueOf(source, ['unidadeexecutora']),
      program: valueOf(source, ['programa', 'eventocusto']),
      modality: valueOf(source, ['modalidade', 'tipodoempenho']) || 'Não informada',
      legalBasis: valueOf(source, ['fundamentolegal']), process: valueOf(source, ['processo']),
      functionName: valueOf(source, ['funcao', 'categoriaeconomica']),
      subfunction: valueOf(source, ['subfuncao', 'elemento']),
      purpose: valueOf(source, ['objcontratacao', 'bemfornecidosouservicoprestados', 'eventocusto']) || 'Não informada',
      committed, cancelled, liquidated, paid, balance, source,
    }
  })
}
