import { ArrowTrendingUpIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { useMemo, useState } from 'react'
import { useDictionary } from '../../../components/dicionario/dicionario'
import { formatCurrency, friendlyModality, friendlyPurpose, friendlyStatus, type PublicRecord } from '../../../data/normalizeCsv'
import { ITEMS_PER_PAGE } from '../constants/home'
import type { PaginationState } from '../types/home'
import { TablePagination } from './TablePagination'
import { SortableTableHeader, type SortDirection } from './SortableTableHeader'

const dateOnly = (value: string) => value.split(' às ')[0] || 'Não informada'

export function LicitationDashboard({ records, municipalityId, panelOpen }: { records: PublicRecord[]; municipalityId: string; panelOpen: boolean }) {
  const { selectionMode, selectItem } = useDictionary()
  const [pagination, setPagination] = useState<PaginationState>({ municipalityId, page: 1 })
  const [sort, setSort] = useState<{ column: number; direction: SortDirection }>({ column: 0, direction: 'desc' })
  const selectable = selectionMode ? 'cursor-help ring-2 ring-amber-300 ring-offset-2 hover:ring-amber-500' : ''
  const cellSelectable = selectionMode ? 'cursor-help rounded px-1 text-left ring-2 ring-amber-300 hover:ring-amber-500' : ''
  const summary = useMemo(() => {
    const approved = records.reduce((sum, item) => sum + (item.approvedValue ?? 0), 0)
    const open = records.filter((item) => item.status.toLowerCase().includes('aberto')).length
    const concluded = records.filter((item) => item.status.toLowerCase().includes('conclu')).length
    const withApprovedValue = records.filter((item) => item.approvedValue !== null).length
    const modalities = Object.entries(records.reduce<Record<string, number>>((map, item) => { const label = friendlyModality(item.modality); map[label] = (map[label] ?? 0) + 1; return map }, {})).sort((a, b) => b[1] - a[1])
    return { approved, open, concluded, withApprovedValue, modalities }
  }, [records])
  const cards = [
    { title: 'Valor final informado', value: formatCurrency(summary.approved), note: `${summary.withApprovedValue} de ${records.length} processos têm valor`, explanation: 'Soma somente dos valores finais disponíveis no arquivo. Como vários processos não informam um valor, este número não representa todo o dinheiro contratado pelo município.' },
    { title: 'Contratações encontradas', value: String(records.length), note: 'processos publicados no arquivo', explanation: 'Quantidade de processos de compra ou contratação encontrados no arquivo do portal.' },
    { title: 'Em andamento', value: String(summary.open), note: 'processos ainda não finalizados', explanation: 'Processos que ainda podem estar recebendo propostas ou aguardando alguma decisão da prefeitura.' },
    { title: 'Finalizados', value: String(summary.concluded), note: 'procedimentos encerrados', explanation: 'Processos que o portal apresenta como finalizados. Isso não significa necessariamente que o pagamento já foi realizado.' },
  ]
  const explain = (record: PublicRecord, title: string, value: string, explanation: string) => selectItem({ title, value, explanation, apiContext: { campoSelecionado: title, valorSelecionado: value, ...record.source } })
  const modalityContext = Object.fromEntries([['campoSelecionado', 'Como a prefeitura contratou'], ['totalDeProcessos', String(records.length)], ...summary.modalities.map(([name, count]) => [`quantidade_${name}`, String(count)])])
  const columns = useMemo(() => [
    { label: 'Publicado em', value: (record: PublicRecord) => { const [day, month, year] = dateOnly(record.publishedAt).split('/'); return Number(`${year}${month}${day}`) || 0 } },
    { label: 'Nº do processo', value: (record: PublicRecord) => record.processNumber },
    { label: 'Como será contratado', value: (record: PublicRecord) => friendlyModality(record.modality) },
    { label: 'O que será comprado ou contratado', value: (record: PublicRecord) => friendlyPurpose(record) },
    { label: 'Andamento', value: (record: PublicRecord) => friendlyStatus(record.status) },
    { label: 'Valor final', value: (record: PublicRecord) => record.approvedValue ?? -1 },
  ], [])
  const sortedRecords = useMemo(() => [...records].sort((a, b) => {
    const first = columns[sort.column].value(a)
    const second = columns[sort.column].value(b)
    const comparison = typeof first === 'number' && typeof second === 'number'
      ? first - second
      : String(first).localeCompare(String(second), 'pt-BR', { numeric: true, sensitivity: 'base' })
    return sort.direction === 'asc' ? comparison : -comparison
  }), [records, sort, columns])
  const changeSort = (column: number) => {
    setSort((current) => ({ column, direction: current.column === column && current.direction === 'asc' ? 'desc' : 'asc' }))
    setPagination({ municipalityId, page: 1 })
  }
  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / ITEMS_PER_PAGE))
  const currentPage = pagination.municipalityId === municipalityId ? Math.min(pagination.page, totalPages) : 1
  const start = (currentPage - 1) * ITEMS_PER_PAGE
  const shown = sortedRecords.slice(start, start + ITEMS_PER_PAGE)
  const goToPage = (page: number) => setPagination({ municipalityId, page: Math.min(Math.max(page, 1), totalPages) })

  return <>
    <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm leading-6 text-blue-950"><strong>Como ler esta página:</strong> “Em andamento” significa que a compra ainda não terminou. “Valor final informado” soma apenas processos que já possuem valor publicado.</div>
    <section className={`mt-8 grid gap-4 sm:grid-cols-2 ${panelOpen ? '2xl:grid-cols-4' : 'lg:grid-cols-4'}`}>{cards.map((card, index) => <button key={card.title} disabled={!selectionMode} onClick={() => selectItem(card)} className={`rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm ${selectable}`}><div className={`mb-5 h-1.5 w-12 rounded-full ${['bg-teal-600','bg-blue-600','bg-amber-500','bg-emerald-600'][index]}`} /><p className="text-sm font-semibold text-slate-500">{card.title}</p><p className="mt-2 text-2xl font-extrabold">{card.value}</p><p className="mt-2 text-xs text-slate-400">{card.note}</p></button>)}</section>
    <section className={`mt-6 grid gap-6 ${panelOpen ? '2xl:grid-cols-[1.6fr_1fr]' : 'lg:grid-cols-[1.6fr_1fr]'}`}><div className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm"><div className="flex justify-between"><div><h2 className="text-lg font-bold">Como a prefeitura contratou</h2><p className="text-sm text-slate-500">Quantidade de processos por forma de contratação</p></div><ArrowTrendingUpIcon className="size-6 text-teal-700" /></div><div className="mt-7 space-y-2">{summary.modalities.slice(0, 5).map(([name, count], index) => {
      const percentage = Math.round(count / records.length * 100)
      return <button key={name} disabled={!selectionMode} onClick={() => selectItem({ title: `Forma de contratação: ${name}`, value: `${count} processos (${percentage}%)`, explanation: `Esta linha mostra quantos processos utilizaram ${name} e qual é sua participação entre as licitações exibidas.`, apiContext: { ...modalityContext, modalidadeSelecionada: name, quantidade: String(count), percentual: `${percentage}%` } })} className={`block w-full rounded-lg p-2 text-left transition ${selectionMode ? 'cursor-help ring-2 ring-amber-300 hover:bg-amber-50 hover:ring-amber-500' : ''}`}><div className="mb-1.5 flex justify-between gap-4 text-sm"><span className="font-semibold">{name}</span><span className="shrink-0">{count} ({percentage}%)</span></div><div className="h-2.5 rounded-full bg-slate-100"><div className={`h-full rounded-full ${index ? 'bg-blue-500' : 'bg-teal-600'}`} style={{ width: `${summary.modalities[0]?.[1] ? count / summary.modalities[0][1] * 100 : 0}%` }} /></div></button>
    })}</div></div><div className="flex flex-col rounded-2xl bg-slate-900 p-6 text-white"><DocumentTextIcon className="size-8 text-teal-300" /><h2 className="mt-5 text-xl font-bold">Transparência que você entende</h2><p className="mt-3 text-sm leading-6 text-slate-300">Termos públicos podem parecer complicados. O Modo Dicionário ajuda você a entender cada informação sem precisar sair desta página.</p><div className="mt-5 space-y-3">{[['1','Ative','Clique em “Entender a tela”.'],['2','Selecione','Escolha um valor, termo ou linha.'],['3','Entenda','Receba uma explicação simples da IA.']].map(([number, title, text]) => <div key={number} className="flex items-center gap-3 rounded-xl bg-white/10 p-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-teal-400 text-xs font-extrabold text-slate-950">{number}</span><div><p className="text-sm font-bold">{title}</p><p className="text-xs text-slate-300">{text}</p></div></div>)}</div><div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-xs font-bold uppercase tracking-wider text-teal-300">Disponível para consulta</p><p className="mt-1 text-lg font-extrabold">{records.length} processos publicados</p></div></div></section>
    <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b px-6 py-5"><h2 className="text-lg font-bold">Processos publicados recentemente</h2><p className="text-sm text-slate-500">Textos simplificados a partir dos dados oficiais. Clique nos títulos das colunas para ordenar.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{columns.map((column, index) => <SortableTableHeader key={column.label} label={column.label} active={sort.column === index} direction={sort.direction} onSort={() => changeSort(index)} />)}</tr></thead><tbody className="divide-y">{shown.map((record) => <tr key={record.id}>{[
      ['Data de publicação', dateOnly(record.publishedAt), 'Data em que o processo foi publicado.'], ['Número do processo', record.processNumber || 'Não informado', 'Código usado para acompanhar a contratação.'], ['Forma de contratação', friendlyModality(record.modality), 'Procedimento usado para escolher o fornecedor.'], ['O que a prefeitura pretende fazer', friendlyPurpose(record), 'Produto ou serviço que a prefeitura pretende contratar.'], ['Andamento', friendlyStatus(record.status), 'Situação atual do processo.'], ['Valor final', record.approvedValue === null ? 'Ainda não informado' : formatCurrency(record.approvedValue), 'Valor aprovado ao final da licitação.'],
    ].map(([title, value, description], index) => <td key={title} className={`px-5 py-4 ${index === 3 ? 'max-w-sm' : ''}`}><button disabled={!selectionMode} onClick={() => explain(record, title, value, description)} className={`${index === 3 ? 'line-clamp-3' : ''} ${cellSelectable}`}>{value}</button></td>)}</tr>)}</tbody></table></div><TablePagination currentPage={currentPage} totalPages={totalPages} totalItems={records.length} start={start} itemsPerPage={ITEMS_PER_PAGE} itemLabel="processos" onPageChange={goToPage} /></section>
  </>
}
