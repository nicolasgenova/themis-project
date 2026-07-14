import { ArrowRightIcon, BookOpenIcon, ChartBarIcon, LightBulbIcon, QuestionMarkCircleIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

const pillars = [
  { icon: UserGroupIcon, title: 'Feito para o cidadão', text: 'A informação pública precisa ser compreendida também por quem não conhece termos jurídicos, contábeis ou administrativos.' },
  { icon: ChartBarIcon, title: 'Dados organizados', text: 'Arquivos de diferentes portais são normalizados e apresentados com a mesma estrutura, usando indicadores, gráficos e tabelas.' },
  { icon: LightBulbIcon, title: 'Explicações no contexto', text: 'A pessoa pode selecionar uma informação e entender seu significado sem abandonar a página ou procurar respostas em outro lugar.' },
]

const steps = [
  ['1', 'Os dados são coletados', 'Informações públicas municipais, como licitações e despesas, são obtidas dos portais de transparência.'],
  ['2', 'Os formatos são padronizados', 'Nomes, datas, valores e categorias diferentes são convertidos para um modelo comum.'],
  ['3', 'A informação é simplificada', 'A interface troca expressões burocráticas por títulos e orientações mais próximos da linguagem cotidiana.'],
  ['4', 'O Dicionário ajuda', 'Quando ainda houver dúvida, a IA e o glossário explicam o item selecionado em linguagem simples.'],
]

export function Sobre() {
  return <main className="flex-1 bg-slate-50">
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute -right-32 -top-32 size-96 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[.22em] text-teal-300">Sobre o Oráculo de Themis</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Transparência pública só é efetiva quando pode ser compreendida.</h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300">O projeto nasceu para aproximar os dados públicos municipais das pessoas. Mais do que disponibilizar números e documentos, a proposta é ajudar o cidadão a entender como os recursos públicos são utilizados.</p>
        <Link to="/transparencia/dados" className="mt-9 inline-flex items-center gap-2 rounded-full bg-teal-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-teal-400">Explorar os dados <ArrowRightIcon className="size-5" /></Link>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
      <div><p className="text-sm font-bold uppercase tracking-wider text-teal-700">Por que este projeto existe?</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Ter acesso não significa, necessariamente, conseguir entender.</h2></div>
      <div className="space-y-5 text-base leading-7 text-slate-600"><p>A Lei de Acesso à Informação ampliou a publicação de dados governamentais no Brasil. Mesmo assim, muitos portais ainda apresentam excesso de termos técnicos, organizações diferentes e interfaces difíceis de navegar.</p><p>Expressões como empenho, liquidação, dotação orçamentária e homologação podem afastar quem não trabalha com administração pública. O Oráculo de Themis busca reduzir essa distância, transformando transparência formal em transparência efetiva.</p></div>
    </section>

    <section className="border-y border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-wider text-teal-700">Nosso propósito</p><h2 className="mt-3 text-3xl font-extrabold text-slate-900">Informação simples, sem perder a origem oficial.</h2></div><div className="mt-10 grid gap-5 md:grid-cols-3">{pillars.map((pillar) => <article key={pillar.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><pillar.icon className="size-8 text-teal-700" /><h3 className="mt-5 text-lg font-bold text-slate-900">{pillar.title}</h3><p className="mt-2 leading-7 text-slate-600">{pillar.text}</p></article>)}</div></div></section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-sm font-bold uppercase tracking-wider text-teal-700">Como funciona</p><h2 className="mt-3 text-3xl font-extrabold text-slate-900">Do portal público até uma tela mais compreensível.</h2><p className="mt-5 leading-7 text-slate-600">O conteúdo original é preservado para consulta e para contextualizar as explicações. A simplificação acontece na camada de apresentação, sem alterar o dado oficial.</p></div><div className="space-y-4">{steps.map(([number, title, text]) => <article key={number} className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-100 font-extrabold text-teal-800">{number}</span><div><h3 className="font-bold text-slate-900">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{text}</p></div></article>)}</div></div>
    </section>

    <section className="bg-teal-50"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"><div className="flex gap-4"><QuestionMarkCircleIcon className="size-7 shrink-0 text-teal-700" /><div><h3 className="font-bold">Ajuda interativa</h3><p className="mt-2 text-sm leading-6 text-slate-600">A explicação aparece ao lado do dado selecionado, mantendo a pessoa na mesma tela.</p></div></div><div className="flex gap-4"><BookOpenIcon className="size-7 shrink-0 text-teal-700" /><div><h3 className="font-bold">Glossário permanente</h3><p className="mt-2 text-sm leading-6 text-slate-600">Conceitos da administração pública podem ser consultados mesmo sem depender da IA.</p></div></div><div className="flex gap-4"><ShieldCheckIcon className="size-7 shrink-0 text-teal-700" /><div><h3 className="font-bold">Responsabilidade com os dados</h3><p className="mt-2 text-sm leading-6 text-slate-600">Informações ausentes são sinalizadas e a IA é apresentada como apoio, não como fonte oficial.</p></div></div></div></section>

    <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-24"><p className="text-sm font-bold uppercase tracking-wider text-teal-700">Trabalho de Conclusão de Curso</p><h2 className="mt-3 text-3xl font-extrabold text-slate-900">Tecnologia a serviço da participação cidadã.</h2><p className="mx-auto mt-5 max-w-3xl leading-7 text-slate-600">O Oráculo de Themis reúne desenvolvimento web, ciência de dados, visualização de informações, usabilidade e inteligência artificial. Como estudo de caso, a plataforma permite avaliar se uma apresentação mais simples pode melhorar o tempo, a confiança e a capacidade das pessoas de compreender dados públicos municipais.</p></section>
  </main>
}
