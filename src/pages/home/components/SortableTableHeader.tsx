import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

export type SortDirection = 'asc' | 'desc'

export function SortableTableHeader({
  label,
  active,
  direction,
  onSort,
}: {
  label: string
  active: boolean
  direction: SortDirection
  onSort: () => void
}) {
  const Icon = active && direction === 'desc' ? ChevronDownIcon : ChevronUpIcon
  const order = active ? (direction === 'asc' ? 'crescente' : 'decrescente') : 'não ordenada'

  return <th scope="col" aria-sort={active ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'} className="px-5 py-3">
    <button type="button" onClick={onSort} title={`Ordenar ${label}: ${order}`} className="group flex items-center gap-1.5 text-left font-bold hover:text-teal-700 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
      <span>{label}</span>
      <Icon className={`size-4 shrink-0 ${active ? 'text-teal-700' : 'text-slate-300 group-hover:text-teal-500'}`} aria-hidden="true" />
      <span className="sr-only">Ordenação {order}</span>
    </button>
  </th>
}
