import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { BookOpenIcon, MagnifyingGlassIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { requestAiExplanation } from '../../services/explanationApi'

export type SelectedItem = { title: string; value?: string; explanation: string; apiContext?: Record<string, unknown> }

type DictionaryContextValue = {
  selectionMode: boolean
  panelOpen: boolean
  selectedItem: SelectedItem | null
  aiBusy: boolean
  setAiBusy: (busy: boolean) => void
  toggleSelectionMode: () => void
  selectItem: (item: SelectedItem) => void
  closePanel: () => void
}

const DictionaryContext = createContext<DictionaryContextValue | null>(null)

export function DictionaryProvider({ children }: { children: ReactNode }) {
  const [selectionMode, setSelectionMode] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null)
  const [aiBusy, setAiBusy] = useState(false)

  const value = useMemo(() => ({
    selectionMode,
    panelOpen,
    selectedItem,
    aiBusy,
    setAiBusy,
    toggleSelectionMode: () => setSelectionMode((active) => {
      const next = !active
      setPanelOpen(next)
      if (next) setSelectedItem(null)
      return next
    }),
    selectItem: (item: SelectedItem) => {
      if (!selectionMode || aiBusy) return
      setSelectedItem(item)
      setPanelOpen(true)
    },
    closePanel: () => {
      setPanelOpen(false)
      setSelectionMode(false)
    },
  }), [aiBusy, panelOpen, selectedItem, selectionMode])

  return <DictionaryContext.Provider value={value}>{children}</DictionaryContext.Provider>
}

// O hook é mantido junto ao provider para concentrar o fluxo do dicionário.
// eslint-disable-next-line react-refresh/only-export-components
export function useDictionary() {
  const context = useContext(DictionaryContext)
  if (!context) throw new Error('useDictionary deve ser usado dentro de DictionaryProvider')
  return context
}

const concepts = [
  { name: 'Despesa pública', description: 'É todo gasto realizado pelo município para manter serviços, executar obras, comprar materiais ou atender à população. Ela passa por etapas de controle — normalmente empenho, liquidação e pagamento — que podem acontecer em datas diferentes.' },
  { name: 'Empenho', description: 'É a reserva de uma parte do orçamento para uma despesa específica. Ele mostra que a prefeitura assumiu aquele compromisso e separou o valor necessário, mas não significa que o produto foi entregue nem que o fornecedor já recebeu.' },
  { name: 'Anulação de empenho', description: 'É o cancelamento total ou parcial de um valor que havia sido reservado. Pode ocorrer quando a compra custa menos, é reduzida ou deixa de acontecer. Por isso, o valor anulado deve ser descontado do valor empenhado.' },
  { name: 'Liquidação', description: 'É a etapa em que a prefeitura verifica se o produto foi entregue ou se o serviço foi prestado conforme o combinado. Depois dessa conferência, o valor fica reconhecido como devido ao fornecedor, mas ainda pode não ter sido pago.' },
  { name: 'Pagamento', description: 'É a etapa em que o dinheiro é efetivamente transferido ao fornecedor. Em condições normais, acontece depois do empenho e da liquidação; por isso, um valor pago é diferente de um valor apenas reservado.' },
  { name: 'Saldo da despesa', description: 'É o valor que ainda permanece registrado na despesa após os movimentos realizados. Dependendo do portal, pode representar uma parte ainda não paga ou ainda disponível no empenho. Para interpretar casos específicos, compare empenhado, anulado, liquidado e pago.' },
  { name: 'Dotação orçamentária', description: 'É a autorização prevista no orçamento para gastar dinheiro em determinada área ou finalidade. Funciona como um limite: a prefeitura não deve realizar a despesa sem que exista uma dotação que a comporte.' },
  { name: 'Unidade orçamentária', description: 'É a área da administração que possui uma parte própria do orçamento e responde pela despesa, como uma Secretaria de Saúde ou Fundo Municipal. Ela ajuda a identificar onde o recurso foi planejado e utilizado.' },
  { name: 'Unidade gestora ou executora', description: 'É o órgão ou setor que administra e executa os recursos públicos registrados. Em alguns portais, unidade gestora e unidade orçamentária podem aparecer com sentidos próximos, embora não sejam necessariamente a mesma estrutura.' },
  { name: 'Programa', description: 'É um conjunto organizado de ações do governo criado para alcançar um objetivo público, como melhorar a atenção básica em saúde. A despesa ligada a um programa mostra a qual objetivo maior aquele gasto pretende contribuir.' },
  { name: 'Função e subfunção', description: 'A função indica a grande área de atuação do gasto, como Saúde ou Educação. A subfunção detalha essa área, como Atenção Básica. Essas classificações facilitam comparar para quais políticas públicas o dinheiro foi direcionado.' },
  { name: 'Categoria econômica', description: 'É uma classificação que ajuda a distinguir a natureza geral do gasto. Em termos simples, separa despesas de funcionamento e manutenção de investimentos ou outras formas de uso dos recursos públicos.' },
  { name: 'Elemento da despesa', description: 'É um código que detalha o tipo de item pago, como material de consumo, serviços, equipamentos ou diárias. O número sozinho pode ser pouco claro; sua descrição oficial é necessária para saber exatamente o que representa.' },
  { name: 'Modalidade de aplicação', description: 'Indica como o dinheiro será aplicado: diretamente pelo próprio município ou transferido para outra entidade executar. Não deve ser confundida com a modalidade de uma licitação, que descreve a forma de contratação.' },
  { name: 'Fonte de recurso', description: 'Indica a origem do dinheiro utilizado, como recursos próprios do município ou transferências dos governos estadual e federal. Ela ajuda a acompanhar de onde veio o valor destinado à despesa.' },
  { name: 'Vínculo do recurso', description: 'Mostra se o dinheiro está ligado a uma finalidade determinada. Um recurso vinculado deve ser usado na área ou objetivo previsto; já um recurso de uso geral costuma oferecer maior liberdade dentro das regras do orçamento.' },
  { name: 'Restos a pagar', description: 'São despesas empenhadas em um ano que não foram pagas até o encerramento desse período. Elas passam para o exercício seguinte e continuam sendo uma obrigação do município, desde que permaneçam válidas.' },
  { name: 'Receita pública', description: 'É o dinheiro que entra nos cofres públicos por meio de impostos, taxas, contribuições, transferências e outras fontes. As receitas financiam os serviços e investimentos realizados pelo município.' },
  { name: 'Fornecedor', description: 'É a pessoa ou empresa relacionada ao fornecimento de um produto ou à prestação de um serviço. O nome no registro não prova, sozinho, que houve pagamento: é preciso observar também os valores liquidado e pago.' },
  { name: 'CPF ou CNPJ', description: 'É o documento usado para identificar a pessoa ou empresa vinculada à despesa. Portais podem ocultar parte do CPF para proteger dados pessoais, sem impedir a compreensão geral do registro.' },
  { name: 'Licitação', description: 'É o processo pelo qual a administração pública busca escolher uma proposta adequada para comprar produtos, contratar serviços ou realizar obras. Ele deve seguir regras de publicidade, igualdade entre participantes e uso responsável do dinheiro público.' },
  { name: 'Número do processo', description: 'É o código usado para identificar e acompanhar um procedimento administrativo. Ele reúne documentos e decisões relacionados à compra, contratação ou despesa e pode ser usado para procurar mais detalhes no portal oficial.' },
  { name: 'Edital', description: 'É o documento que apresenta as regras da licitação: o que será contratado, prazos, requisitos, critérios de escolha e obrigações dos participantes. Fornecedores interessados devem seguir essas condições.' },
  { name: 'Modalidade de licitação', description: 'É a forma de conduzir a seleção dos fornecedores, definida conforme o objeto e as regras aplicáveis. Pregão e concorrência são exemplos. Dispensa e inexigibilidade são formas de contratação direta previstas em lei, não modalidades de disputa.' },
  { name: 'Pregão', description: 'É uma forma de disputa usada principalmente para bens e serviços comuns, cujas características podem ser descritas objetivamente. Os fornecedores apresentam propostas e lances, e o preço é analisado junto com os requisitos do edital.' },
  { name: 'Concorrência', description: 'É uma modalidade de licitação com ampla participação, utilizada conforme as características e o valor da contratação. As propostas são avaliadas segundo os critérios definidos no edital, como menor preço ou técnica e preço.' },
  { name: 'Dispensa de licitação', description: 'É uma contratação direta que a lei permite em situações específicas, como certos limites de valor, emergência ou licitação sem interessados. A dispensa não elimina a obrigação de justificar a escolha, pesquisar preços e divulgar os atos exigidos.' },
  { name: 'Inexigibilidade', description: 'Ocorre quando uma competição não é viável, como na contratação de fornecedor exclusivo ou de determinado serviço técnico, desde que os requisitos legais sejam atendidos. A prefeitura deve demonstrar por que não existe disputa possível e justificar o preço.' },
  { name: 'Fundamento legal', description: 'É a lei, artigo ou regra usada para justificar um ato administrativo, como uma contratação direta ou uma despesa. Esse campo permite verificar qual autorização jurídica foi aplicada ao caso.' },
  { name: 'Publicação ou postagem', description: 'É a data em que o aviso ou processo foi disponibilizado ao público no portal. Ela não é necessariamente a data da disputa, da assinatura do contrato, da entrega ou do pagamento.' },
  { name: 'Data de realização', description: 'É a data prevista para uma etapa importante da contratação, como a abertura ou o recebimento de propostas. Ela pode ser alterada, por isso também é importante consultar a atualização e a situação do processo.' },
  { name: 'Situação do processo', description: 'Mostra o andamento informado pelo portal, como aberto, finalizado, cancelado ou suspenso. Um processo finalizado não significa, por si só, que o produto já foi entregue ou que o pagamento foi realizado.' },
  { name: 'Valor estimado', description: 'É uma previsão de quanto a prefeitura espera gastar, geralmente baseada em pesquisa de preços feita antes da disputa. Serve como referência de planejamento e não corresponde necessariamente ao valor final contratado ou pago.' },
  { name: 'Valor homologado ou final', description: 'É o valor aprovado ao término da licitação para a proposta vencedora. Ele pode ser menor que o estimado e ainda não representa dinheiro já pago, pois contratação, entrega, liquidação e pagamento são etapas posteriores.' },
  { name: 'Homologação', description: 'É a confirmação da autoridade responsável de que o procedimento e seu resultado podem ser aprovados. Normalmente ocorre após o julgamento das propostas, mas ainda não equivale à entrega do objeto nem ao pagamento.' },
  { name: 'Contrato', description: 'É o documento que formaliza direitos e obrigações entre a prefeitura e o contratado, incluindo objeto, valores, prazos, fiscalização e penalidades. Nem toda contratação gera o mesmo tipo de instrumento contratual, mas deve existir um registro formal adequado.' },
  { name: 'Convênio', description: 'É um acordo de cooperação para realizar um objetivo de interesse público em comum, frequentemente envolvendo transferência de recursos e prestação de contas. Diferentemente de um contrato comum, as partes colaboram para alcançar uma finalidade compartilhada.' },
]

type Concept = (typeof concepts)[number]

function linkedDescription(concept: Concept, openConcept: (concept: Concept) => void) {
  const related = concepts
    .filter((item) => item !== concept && concept.description.toLocaleLowerCase('pt-BR').includes(item.name.toLocaleLowerCase('pt-BR')))
    .sort((a, b) => b.name.length - a.name.length)
  if (!related.length) return concept.description

  const expression = new RegExp(`(${related.map((item) => item.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  const byName = new Map(related.map((item) => [item.name.toLocaleLowerCase('pt-BR'), item]))

  return concept.description.split(expression).map((part, index) => {
    const destination = byName.get(part.toLocaleLowerCase('pt-BR'))
    return destination
      ? <button key={`${destination.name}-${index}`} type="button" onClick={() => openConcept(destination)} className="font-semibold text-teal-700 underline decoration-teal-300 underline-offset-2 hover:text-teal-900" title={`Abrir o conceito “${destination.name}”`}>{part}</button>
      : part
  })
}

export default function Dicionario() {
  const { panelOpen, selectedItem, closePanel, aiBusy, setAiBusy } = useDictionary()
  const [tab, setTab] = useState<'explanation' | 'concepts'>('explanation')
  const [search, setSearch] = useState('')
  const [activeConcept, setActiveConcept] = useState<Concept | null>(null)
  const [aiResult, setAiResult] = useState<{ item: SelectedItem; explanation: string; status: 'success' | 'fallback' } | null>(null)
  const [question, setQuestion] = useState('')
  const [answeredQuestion, setAnsweredQuestion] = useState('')

  useEffect(() => {
    if (!selectedItem?.apiContext || !panelOpen) return
    const controller = new AbortController()
    setAiBusy(true)
    requestAiExplanation(selectedItem, controller.signal)
      .then((explanation) => { setAnsweredQuestion(''); setAiResult({ item: selectedItem, explanation, status: 'success' }) })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setAiResult({ item: selectedItem, explanation: '', status: 'fallback' })
      })
      .finally(() => setAiBusy(false))
    return () => { controller.abort(); setAiBusy(false) }
  }, [panelOpen, selectedItem, setAiBusy])

  const aiStatus = !selectedItem?.apiContext ? 'idle' : aiResult?.item === selectedItem ? aiResult.status : 'loading'
  const aiExplanation = aiResult?.item === selectedItem ? aiResult.explanation : ''

  const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')
  const filtered = concepts.filter((concept) => `${concept.name} ${concept.description}`.toLocaleLowerCase('pt-BR').includes(normalizedSearch))

  async function askQuestion(event: React.FormEvent) {
    event.preventDefault()
    const currentQuestion = question.trim()
    if (!selectedItem?.apiContext || !currentQuestion || aiBusy) return
    setAiBusy(true)
    setAnsweredQuestion(currentQuestion)
    setQuestion('')
    try {
      const explanation = await requestAiExplanation(selectedItem, undefined, currentQuestion)
      setAiResult({ item: selectedItem, explanation, status: 'success' })
    } catch {
      setAiResult({ item: selectedItem, explanation: '', status: 'fallback' })
    } finally {
      setAiBusy(false)
    }
  }

  return (
    <>
      <aside aria-label="Dicionário" className={`fixed right-0 top-20 z-20 flex h-[calc(100vh-5rem)] w-full max-w-md flex-col border-t border-slate-200 bg-white shadow-2xl transition-transform duration-300 ${panelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div><p className="text-xs font-bold uppercase tracking-[.2em] text-teal-700">Apoio à compreensão</p><h2 className="mt-1 text-xl font-bold text-slate-900">Dicionário</h2></div>
          <button onClick={closePanel} className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Fechar"><XMarkIcon className="size-6" /></button>
        </div>
        <div className="grid grid-cols-2 border-b border-slate-200 px-5 pt-3">
          <button onClick={() => setTab('explanation')} className={`flex items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold ${tab === 'explanation' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500'}`}><SparklesIcon className="size-5" /> Explicação com IA</button>
          <button onClick={() => setTab('concepts')} className={`flex items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold ${tab === 'concepts' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500'}`}><BookOpenIcon className="size-5" /> Conceitos</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'explanation' ? (
            selectedItem ? <div><p className="text-sm text-slate-500">Você selecionou</p><div className="mt-3 rounded-2xl bg-teal-50 p-5"><h3 className="font-bold text-slate-900">{selectedItem.title}</h3>{selectedItem.value && <p className="mt-1 text-xl font-extrabold text-teal-700">{selectedItem.value}</p>}</div><div className="mt-6 space-y-4 text-[15px] leading-7 text-slate-600">{answeredQuestion && <div className="rounded-xl border border-violet-100 bg-violet-50 p-3"><p className="text-xs font-bold uppercase tracking-wide text-violet-700">Sua pergunta</p><p className="mt-1 text-sm text-violet-950">{answeredQuestion}</p></div>}{aiStatus === 'loading' || aiBusy ? <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4" role="status"><span className="size-5 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" /><span>A IA está respondendo. Aguarde para fazer outra pergunta.</span></div> : <p>{aiStatus === 'success' ? aiExplanation : selectedItem.explanation}</p>}{aiStatus === 'success' && !aiBusy && <p className="rounded-xl bg-violet-50 p-3 text-xs leading-5 text-violet-800">Explicação gerada por inteligência artificial. Consulte os dados oficiais em caso de dúvida.</p>}{aiStatus === 'fallback' && !aiBusy && <p className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">A IA não está disponível agora. Exibimos uma explicação preparada pelo sistema.</p>}{selectedItem.apiContext && <form onSubmit={askQuestion} className="border-t border-slate-200 pt-5"><label htmlFor="ai-question" className="text-sm font-bold text-slate-800">Ainda ficou com dúvida?</label><textarea id="ai-question" value={question} onChange={(event) => setQuestion(event.target.value)} disabled={aiBusy} maxLength={500} rows={3} placeholder={aiBusy ? 'Aguarde a resposta atual...' : 'Faça uma pergunta sobre este item'} className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-teal-600 disabled:cursor-not-allowed disabled:bg-slate-100" /><button type="submit" disabled={aiBusy || !question.trim()} className="mt-2 w-full rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300">{aiBusy ? 'Aguarde a resposta' : 'Perguntar à IA'}</button></form>}<p className="border-t border-slate-200 pt-5 text-sm">Para entender outro item, clique em uma nova informação da tela.</p></div></div>
            : <div className="rounded-2xl bg-teal-50 p-5"><h3 className="font-bold text-slate-900">Modo Dicionário ativado</h3><p className="mt-2 text-sm leading-6 text-slate-600">Clique em qualquer informação destacada na tela para receber uma explicação simples.</p></div>
          ) : (
            <div><label className="relative block"><MagnifyingGlassIcon className="absolute left-3 top-3 size-5 text-slate-400" /><input value={search} onChange={(e) => { setSearch(e.target.value); setActiveConcept(null) }} placeholder="Pesquisar conceito ou palavra..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 outline-none focus:border-teal-600" /></label>{activeConcept ? <div className="mt-6"><button onClick={() => setActiveConcept(null)} className="text-sm font-semibold text-teal-700">← Todos os conceitos</button><h3 className="mt-5 text-xl font-bold">{activeConcept.name}</h3><p className="mt-3 leading-7 text-slate-600">{linkedDescription(activeConcept, setActiveConcept)}</p><p className="mt-5 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-400">Os termos sublinhados levam a outros conceitos relacionados deste dicionário.</p></div> : <div className="mt-5"><p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{filtered.length} conceitos encontrados</p><div className="space-y-1">{filtered.map((concept) => <button key={concept.name} onClick={() => setActiveConcept(concept)} className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-800"><span>{concept.name}</span><span aria-hidden>›</span></button>)}{!filtered.length && <p className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">Nenhum conceito encontrado. Tente pesquisar outra palavra ou selecione um item da tela para pedir uma explicação à IA.</p>}</div></div>}</div>
          )}
        </div>
      </aside>
    </>
  )
}
