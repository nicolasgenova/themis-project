import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import type { DataMode } from '../types/home'
import { ModeSwitch } from './ModeSwitch'

export function HomeHeader({ municipality, mode, onModeChange }: { municipality: string; mode: DataMode; onModeChange: (mode: DataMode) => void }) {
  const expenses = mode === 'expenses'
  return <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div><p className="text-sm font-bold uppercase tracking-wider text-teal-700">Município de {municipality}</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">{expenses ? 'Despesas da prefeitura' : 'Compras e contratações da prefeitura'}</h1><p className="mt-2 text-slate-500">{expenses ? 'Acompanhe os valores reservados, confirmados e pagos pelo município.' : 'Veja o que a prefeitura pretende comprar ou contratar e como cada processo está.'}</p></div>
    <div className="flex flex-wrap items-center gap-3"><ModeSwitch mode={mode} onChange={onModeChange} /><div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"><CalendarDaysIcon className="size-5 text-teal-700" /> Dados de 2026</div></div>
  </div>
}
