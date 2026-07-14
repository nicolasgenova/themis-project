import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import adamantinaBidsCsv from './Adamantina/Licitacoes/Adamantina.csv?raw'
import adamantinaExpensesCsv from './Adamantina/Despesas/wpDespesaOrcamentariaPosicaoAtualExportCSV.csv?raw'
import mariliaBidsCsv from './Marilia/Licitacoes/Marilia.csv?raw'
import mariliaExpensesCsv from './Marilia/Despesas/PMMARILIA_exportacao_grid_a1b8cc4a-5397-49b2-a950-41c48f85d20c_DespesaseInvestimentos-Mensal2026-Julho.csv?raw'
import { normalizeTransparencyCsv, type PublicRecord } from './normalizeCsv'
import { normalizeExpensesCsv, type ExpenseRecord } from './normalizeExpenses'

export type MunicipalityId = 'adamantina' | 'marilia'

type Municipality = { id: MunicipalityId; name: string; state: string; bidSourceFile: string; expenseSourceFile: string; records: PublicRecord[]; expenses: ExpenseRecord[] }

function createMunicipality(id: MunicipalityId, name: string, bidSourceFile: string, expenseSourceFile: string, bidsCsv: string, expensesCsv: string): Municipality {
  const municipality = `${name} - SP`
  return {
    id, name, state: 'SP', bidSourceFile, expenseSourceFile,
    records: normalizeTransparencyCsv(bidsCsv).map((record) => ({ ...record, source: { Município: municipality, ...record.source } })),
    expenses: normalizeExpensesCsv(expensesCsv).map((record) => ({ ...record, source: { Município: municipality, ...record.source } })),
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const municipalities: Municipality[] = [
  createMunicipality('adamantina', 'Adamantina', 'Adamantina.csv', 'Despesas de Adamantina.csv', adamantinaBidsCsv, adamantinaExpensesCsv),
  createMunicipality('marilia', 'Marília', 'Marilia.csv', 'Despesas de Marília.csv', mariliaBidsCsv, mariliaExpensesCsv),
]

type MunicipalityContextValue = { municipality: Municipality; municipalityId: MunicipalityId; setMunicipalityId: (id: MunicipalityId) => void }
const MunicipalityContext = createContext<MunicipalityContextValue | null>(null)

export function MunicipalityProvider({ children }: { children: ReactNode }) {
  const [municipalityId, setMunicipalityId] = useState<MunicipalityId>('adamantina')
  const selected = municipalities.find((item) => item.id === municipalityId) ?? municipalities[0]
  const value = useMemo(() => ({ municipality: selected, municipalityId, setMunicipalityId }), [municipalityId, selected])
  return <MunicipalityContext.Provider value={value}>{children}</MunicipalityContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMunicipality() {
  const context = useContext(MunicipalityContext)
  if (!context) throw new Error('useMunicipality deve ser usado dentro de MunicipalityProvider')
  return context
}
