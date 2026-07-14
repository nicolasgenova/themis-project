import { useState } from 'react'
import { useDictionary } from '../../components/dicionario/dicionario'
import { ExpenseDashboard } from '../../components/expenses/expenseDashboard'
import { useMunicipality } from '../../data/municipalities'
import { DASHBOARD_MAX_WIDTH } from './constants/home'
import { HomeHeader } from './components/HomeHeader'
import { LicitationDashboard } from './components/LicitationDashboard'
import type { DataMode } from './types/home'

export function Home() {
  const { selectionMode, panelOpen } = useDictionary()
  const { municipality } = useMunicipality()
  const [mode, setMode] = useState<DataMode>('bids')
  const width = panelOpen ? 'lg:mr-[28rem] lg:w-[calc(100%-28rem)] lg:max-w-none' : `mx-auto ${DASHBOARD_MAX_WIDTH}`

  return <main className={`w-full flex-1 px-4 py-8 transition-[width,margin,max-width] duration-300 sm:px-6 lg:px-8 ${width}`}>
    {selectionMode && <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950"><strong>Modo Dicionário ativado.</strong> Clique em uma informação destacada para entendê-la.</div>}
    <HomeHeader municipality={municipality.name} mode={mode} onModeChange={setMode} />
    {mode === 'bids'
      ? <LicitationDashboard records={municipality.records} municipalityId={municipality.id} panelOpen={panelOpen} />
      : <ExpenseDashboard key={municipality.id} records={municipality.expenses} panelOpen={panelOpen} />}
  </main>
}
