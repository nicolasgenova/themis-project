import { Outlet } from 'react-router-dom'
import Header from '../../components/header/header'
import { Footer } from '../../components/footer/footer'
import Dicionario, { DictionaryProvider } from '../../components/dicionario/dicionario'
import { MunicipalityProvider } from '../../data/municipalities'

export default function AppIndex() {
  return <MunicipalityProvider><DictionaryProvider><div className="flex min-h-screen flex-col bg-slate-50"><Header /><Outlet /><Footer /><Dicionario /></div></DictionaryProvider></MunicipalityProvider>
}
