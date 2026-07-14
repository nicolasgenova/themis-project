import { ArrowTrendingUpIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { useMemo, useState } from 'react'
import { useDictionary } from '../dicionario/dicionario'
import { type ExpenseRecord } from '../../data/normalizeExpenses'
import { formatCurrency } from '../../data/normalizeCsv'
import { TablePagination } from '../../pages/home/components/TablePagination'
import { SortableTableHeader, type SortDirection } from '../../pages/home/components/SortableTableHeader'

export function ExpenseDashboard({ records, panelOpen }: { records: ExpenseRecord[]; panelOpen: boolean }) {
  const { selectionMode, selectItem } = useDictionary()
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<{ column: number; direction: SortDirection }>({ column: 1, direction: 'desc' })
  const selectable = selectionMode ? 'cursor-help ring-2 ring-amber-300 ring-offset-2 hover:ring-amber-500' : ''
  const cellSelectable = selectionMode ? 'cursor-help rounded px-1 text-left ring-2 ring-amber-300 hover:ring-amber-500' : ''
  const summary = useMemo(() => {
    const totals = records.reduce((result, item) => ({ committed: result.committed + item.committed, cancelled: result.cancelled + item.cancelled, liquidated: result.liquidated + item.liquidated, paid: result.paid + item.paid, balance: result.balance + item.balance }), { committed: 0, cancelled: 0, liquidated: 0, paid: 0, balance: 0 })
    const units = Object.entries(records.reduce<Record<string, number>>((result, item) => { result[item.budgetUnit] = (result[item.budgetUnit] ?? 0) + Math.max(0, item.committed - item.cancelled); return result }, {})).sort((a, b) => b[1] - a[1])
    return { ...totals, units }
  }, [records])
  const cards = [
    { title: 'Valor empenhado', value: formatCurrency(summary.committed), note: 'valor reservado para despesas', explanation: 'É o total que a prefeitura reservou no orçamento para assumir estas despesas.' },
    { title: 'Valor anulado', value: formatCurrency(summary.cancelled), note: 'reservas canceladas', explanation: 'É a parte dos empenhos que foi cancelada e deixou de ficar reservada para a despesa.' },
    { title: 'Valor liquidado', value: formatCurrency(summary.liquidated), note: 'entrega ou serviço confirmado', explanation: 'É o valor de produtos entregues ou serviços realizados e conferidos pela prefeitura.' },
    { title: 'Valor pago', value: formatCurrency(summary.paid), note: 'dinheiro efetivamente transferido', explanation: 'É o valor que já foi efetivamente pago aos fornecedores.' },
  ]
  const explain = (record: ExpenseRecord, title: string, value: string, explanation: string) => selectItem({ title, value, explanation, apiContext: { campoSelecionado: title, valorSelecionado: value, ...record.source } })
  const columns = useMemo(() => [
    { label: 'Empenho', value: (record: ExpenseRecord) => record.commitmentNumber },
    { label: 'Data', value: (record: ExpenseRecord) => { const [day, month, year] = record.date.split('/'); return Number(`${year}${month}${day}`) || 0 } },
    { label: 'Fornecedor', value: (record: ExpenseRecord) => record.supplier },
    { label: 'Unidade orçamentária', value: (record: ExpenseRecord) => record.budgetUnit },
    { label: 'Programa ou finalidade', value: (record: ExpenseRecord) => record.program || record.purpose },
    { label: 'Modalidade', value: (record: ExpenseRecord) => record.modality },
    { label: 'Empenhado', value: (record: ExpenseRecord) => record.committed },
    { label: 'Anulado', value: (record: ExpenseRecord) => record.cancelled },
    { label: 'Liquidado', value: (record: ExpenseRecord) => record.liquidated },
    { label: 'Pago', value: (record: ExpenseRecord) => record.paid },
    { label: 'Saldo', value: (record: ExpenseRecord) => record.balance },
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
    setPage(1)
  }
  const perPage = 10
  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * perPage
  const shown = sortedRecords.slice(start, start + perPage)
  const chartContext = Object.fromEntries([['campoSelecionado', 'Despesas empenhadas por unidade'], ['totalRegistros', String(records.length)], ...summary.units.slice(0, 10).map(([unit, value]) => [unit, formatCurrency(value)])])

  return <>
    <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm leading-6 text-blue-950"><strong>Como ler esta página:</strong> primeiro o dinheiro é reservado (“empenhado”), depois a entrega é confirmada (“liquidado”) e, por fim, ocorre o pagamento. Esses valores representam etapas diferentes.</div>
    <section className={`mt-8 grid gap-4 sm:grid-cols-2 ${panelOpen ? '2xl:grid-cols-4' : 'lg:grid-cols-4'}`}>{cards.map((card, index) => <button key={card.title} disabled={!selectionMode} onClick={() => selectItem({ ...card, apiContext: { campoSelecionado: card.title, valor: card.value, totalRegistros: String(records.length) } })} className={`rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm ${selectable}`}><div className={`mb-5 h-1.5 w-12 rounded-full ${['bg-teal-600','bg-rose-500','bg-blue-600','bg-emerald-600'][index]}`} /><p className="text-sm font-semibold text-slate-500">{card.title}</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{card.value}</p><p className="mt-2 text-xs text-slate-400">{card.note}</p></button>)}</section>
    <section className={`mt-6 grid gap-6 ${panelOpen ? '2xl:grid-cols-[1.6fr_1fr]' : 'lg:grid-cols-[1.6fr_1fr]'}`}>
      <button disabled={!selectionMode} onClick={() => selectItem({ title: 'Despesas por unidade da prefeitura', value: `${records.length} registros analisados`, explanation: 'Compara quanto foi reservado para despesas em cada unidade da prefeitura.', apiContext: chartContext })} className={`w-full rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm ${selectable}`}><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold">Onde as despesas foram empenhadas</h2><p className="mt-1 text-sm text-slate-500">Unidades com maior valor reservado, descontadas as anulações</p></div><ArrowTrendingUpIcon className="size-6 text-teal-700" /></div><div className="mt-7 space-y-4">{summary.units.slice(0, 5).map(([unit, value], index) => <div key={unit}><div className="mb-1.5 flex gap-4 text-sm"><span className="min-w-0 flex-1 truncate font-semibold text-slate-700">{unit}</span><span className="text-slate-500">{formatCurrency(value)}</span></div><div className="h-2.5 rounded-full bg-slate-100"><div className={`h-2.5 rounded-full ${index === 0 ? 'bg-teal-600' : 'bg-blue-500'}`} style={{ width: `${summary.units[0]?.[1] ? value / summary.units[0][1] * 100 : 0}%` }} /></div></div>)}</div></button>
      <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm"><DocumentTextIcon className="size-8 text-teal-300" /><h2 className="mt-5 text-xl font-bold">Transparência que você entende</h2><p className="mt-3 text-sm leading-6 text-slate-300">Use o botão “Entender a tela” para ativar o Modo Dicionário e receber explicações simples sobre empenhos, pagamentos, fornecedores e demais informações publicadas.</p><div className="mt-6 rounded-xl bg-white/10 p-4"><p className="text-xs uppercase tracking-wider text-teal-300">Dados preparados para consulta</p><p className="mt-1 font-bold">{records.length} despesas normalizadas</p></div></div>
    </section>
    <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b px-6 py-5"><h2 className="text-lg font-bold">Despesas publicadas</h2><p className="text-sm text-slate-500">Informações padronizadas dos dados oficiais. Clique nos títulos das colunas para ordenar.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[1500px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{columns.map((column, index) => <SortableTableHeader key={column.label} label={column.label} active={sort.column === index} direction={sort.direction} onSort={() => changeSort(index)} />)}</tr></thead><tbody className="divide-y">{shown.map((record) => {
      const cells = [
        ['Número do empenho', record.commitmentNumber, 'Código que identifica a reserva desta despesa.'], ['Data da despesa', record.date, 'Data em que o empenho ou movimento foi registrado.'], ['Fornecedor', record.supplier, 'Pessoa ou empresa relacionada à despesa.'], ['Unidade orçamentária', record.budgetUnit, 'Área da prefeitura responsável pelo orçamento desta despesa.'], ['Programa ou finalidade', record.program || record.purpose, 'Indica a ação pública ou finalidade relacionada à despesa.'], ['Modalidade', record.modality, 'Forma administrativa informada para esta despesa.'], ['Valor empenhado', formatCurrency(record.committed), 'Valor reservado no orçamento.'], ['Valor anulado', formatCurrency(record.cancelled), 'Parte da reserva que foi cancelada.'], ['Valor liquidado', formatCurrency(record.liquidated), 'Valor cuja entrega ou serviço já foi confirmado.'], ['Valor pago', formatCurrency(record.paid), 'Valor efetivamente transferido ao fornecedor.'], ['Saldo', formatCurrency(record.balance), 'Valor que permanece registrado como saldo desta despesa.'],
      ]
      return <tr key={record.id}>{cells.map(([title, value, description], index) => <td key={title} className={`px-5 py-4 ${index >= 6 ? 'whitespace-nowrap font-semibold' : 'max-w-xs'}`}><button disabled={!selectionMode} onClick={() => explain(record, title, value, description)} className={`${index === 4 ? 'line-clamp-3' : ''} ${cellSelectable}`}>{value || 'Não informado'}</button></td>)}</tr>
    })}</tbody></table></div><TablePagination currentPage={currentPage} totalPages={totalPages} totalItems={records.length} start={start} itemsPerPage={perPage} itemLabel="despesas" onPageChange={setPage} /></section>
  </>
}
