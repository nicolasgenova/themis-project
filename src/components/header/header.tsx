import { ChartBarSquareIcon, InformationCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Link, NavLink, useLocation } from 'react-router-dom'
import logo from '../../images/logo.png'
import { useDictionary } from '../dicionario/dicionario'
import { municipalities, type MunicipalityId, useMunicipality } from '../../data/municipalities'

export default function Header() {
  const { selectionMode, toggleSelectionMode, closePanel } = useDictionary()
  const { municipalityId, setMunicipalityId } = useMunicipality()
  const { pathname } = useLocation()
  const showMunicipality = pathname === '/transparencia/dados' || pathname === '/transparencia/dados/'
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Navegação principal">
        <Link to="/transparencia/home" onClick={closePanel} className="flex min-w-0 items-center gap-3">
          <img src={logo} alt="Oráculo de Themis" className="h-14 w-auto object-contain sm:h-16" />
          <div className="hidden border-l border-slate-200 pl-3 sm:block"><p className="text-sm font-bold text-slate-900">Transparência Pública</p><p className="text-xs text-slate-500">Informação simples para todos</p></div>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <NavLink to="/transparencia/home" onClick={closePanel} className={({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}><InformationCircleIcon className="size-5" /><span className="hidden md:inline">Sobre</span></NavLink>
          <NavLink to="/transparencia/dados" onClick={closePanel} className={({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}><ChartBarSquareIcon className="size-5" /><span className="hidden md:inline">Dados</span></NavLink>
          {showMunicipality && <><label className="hidden text-sm text-slate-500 md:block" htmlFor="municipio">Município</label>
          <select id="municipio" value={municipalityId} onChange={(event) => { closePanel(); setMunicipalityId(event.target.value as MunicipalityId) }} className="max-w-36 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 sm:max-w-none">{municipalities.map((item) => <option key={item.id} value={item.id}>{item.name} - {item.state}</option>)}</select></>}
          <button onClick={toggleSelectionMode} aria-pressed={selectionMode} className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold transition sm:px-4 ${selectionMode ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-100' : 'bg-teal-700 text-white hover:bg-teal-800'}`}><QuestionMarkCircleIcon className="size-5" /><span className="hidden sm:inline">{selectionMode ? 'Sair do modo' : 'Entender a tela'}</span></button>
        </div>
      </nav>
    </header>
  )
}
