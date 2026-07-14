import type { DataMode } from '../types/home'

export function ModeSwitch({ mode, onChange }: { mode: DataMode; onChange: (mode: DataMode) => void }) {
  return <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1" aria-label="Tipo de informação">
    <button onClick={() => onChange('bids')} className={`rounded-lg px-4 py-2 text-sm font-bold ${mode === 'bids' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>Licitações</button>
    <button onClick={() => onChange('expenses')} className={`rounded-lg px-4 py-2 text-sm font-bold ${mode === 'expenses' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>Despesas</button>
  </div>
}
