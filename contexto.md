INTRODUÇÃO
A transparência pública representa um dos principais mecanismos de fortalecimento da democracia e do controle social, permitindo que cidadãos acompanhem a utilização dos recursos públicos e fiscalizem a administração governamental. No Brasil, a publicação dessas informações foi ampliada com a criação da Lei de Acesso à Informação (Lei nº 12.527/2011), que determina que órgãos públicos disponibilizem dados de interesse coletivo em portais eletrônicos acessíveis à população.
Apesar da obrigatoriedade legal, muitos portais da transparência ainda apresentam dificuldades relacionadas à organização das informações, excesso de termos técnicos, baixa padronização dos dados e interfaces pouco intuitivas. Como consequência, cidadãos sem conhecimento técnico frequentemente encontram barreiras para compreender o significado das informações exibidas, dificultando o exercício efetivo do controle social.
Nesse contexto, o presente Trabalho de Conclusão de Curso propõe o desenvolvimento de um sistema web voltado à simplificação da interpretação de dados públicos municipais. O sistema realizará a coleta e organização automática de informações de gastos públicos provenientes de portais da transparência municipais, apresentando os dados de forma mais acessível e compreensível.
Como diferencial principal, a plataforma contará com uma funcionalidade interativa baseada em Inteligência Artificial, permitindo que o usuário clique em um botão de ajuda (“?”) e selecione qualquer elemento da interface para obter explicações em linguagem simples sobre o conteúdo exibido. A explicação será gerada por meio da integração com a API da OpenAI, funcionando como uma espécie de “dicionário inteligente” dos termos utilizados em transparência pública.
Além da interpretação textual, o sistema também poderá apresentar gráficos, indicadores e informações organizadas visualmente, contribuindo para facilitar a navegação e compreensão dos dados públicos. Dessa forma, o projeto busca reduzir a distância entre a transparência formal — caracterizada apenas pela disponibilização dos dados — e a transparência efetiva, em que a população realmente compreende as informações divulgadas.
O sistema será aplicado inicialmente ao portal de transparência de um município específico, servindo como estudo de caso para avaliar a viabilidade da proposta, a usabilidade da ferramenta e sua contribuição para a democratização do acesso à informação pública.
OBJETIVOS E JUSTIFICATIVA
Objetivo Geral
Desenvolver um sistema web capaz de coletar, organizar e apresentar dados de gastos públicos municipais de forma acessível, utilizando recursos de Inteligência Artificial para explicar termos técnicos e auxiliar cidadãos na compreensão das informações disponibilizadas em portais da transparência.
Objetivos Específicos
• Identificar a estrutura e o formato dos dados disponibilizados em portais da transparência municipais;
• Desenvolver um mecanismo automatizado para coleta de informações públicas;
• Padronizar e organizar os dados obtidos em banco de dados estruturado;
• Criar uma interface web intuitiva para visualização das despesas públicas;
• Implementar uma funcionalidade interativa de auxílio baseada na API da OpenAI;
• Permitir que usuários obtenham explicações simplificadas sobre termos e informações exibidas na plataforma;
• Avaliar a usabilidade do sistema com usuários comuns;
• Comparar a facilidade de compreensão entre o portal oficial e o sistema desenvolvido.
Justificativa
Embora os portais de transparência tenham ampliado o acesso às informações públicas, grande parte da população ainda encontra dificuldades para interpretar os dados disponibilizados. Termos técnicos
relacionados à administração pública, licitações, empenhos, dotações orçamentárias e contratos tornam a navegação complexa para usuários sem conhecimento especializado.
Além disso, muitos portais apresentam problemas de usabilidade, organização visual e padronização das informações, o que dificulta ainda mais a compreensão dos dados públicos. Dessa forma, a simples disponibilização das informações não garante que a transparência seja efetivamente acessível à população.
O desenvolvimento de uma ferramenta que traduza esses conceitos técnicos para uma linguagem simples pode contribuir significativamente para ampliar o acesso à informação e incentivar a participação cidadã no acompanhamento dos gastos públicos.
A utilização de Inteligência Artificial como mecanismo de explicação contextual representa uma abordagem inovadora, permitindo que o usuário receba auxílio diretamente sobre os elementos visualizados na interface, tornando o processo de aprendizagem mais intuitivo e interativo.
Assim, este projeto possui relevância acadêmica, tecnológica e social, ao integrar conceitos de ciência de dados, desenvolvimento web, usabilidade e Inteligência Artificial em uma aplicação voltada à democratização da transparência pública.
REVISÃO DE LITERATURA
A transparência pública é considerada um elemento essencial para o fortalecimento da administração pública democrática, permitindo maior fiscalização social e redução de práticas irregulares. No Brasil, a Lei de Acesso à Informação (Lei nº 12.527/2011) consolidou a obrigatoriedade da divulgação de informações públicas em meios digitais, impulsionando a criação de portais de transparência em diferentes níveis governamentais.
Entretanto, diversos estudos apontam que a mera disponibilização dos dados não garante sua efetiva compreensão pela população. Segundo Silva et al. (2022), muitos portais governamentais apresentam problemas relacionados à linguagem técnica, navegação complexa e baixa acessibilidade informacional.
Oliveira et al. (2023) destacam que a usabilidade é um fator determinante para o sucesso de sistemas públicos digitais. Interfaces confusas, excesso de informações e organização inadequada prejudicam a experiência dos usuários e dificultam o acesso ao conteúdo desejado.
Além disso, Souza et al. (2021) afirmam que cidadãos sem formação técnica encontram obstáculos para interpretar conceitos administrativos e financeiros presentes em relatórios públicos, reduzindo a efetividade do controle social.
Nesse cenário, tecnologias de Inteligência Artificial vêm sendo utilizadas para simplificar a interação entre usuários e sistemas computacionais. Modelos de linguagem natural, como os utilizados pela OpenAI, permitem gerar explicações automatizadas em linguagem simples, auxiliando usuários na interpretação de conteúdos técnicos.
Ferreira et al. (2024) apontam que a integração entre ciência de dados, visualização de informações e Inteligência Artificial possui potencial para tornar dados públicos mais acessíveis e compreensíveis, especialmente quando aplicada em interfaces interativas voltadas ao cidadão comum.
Dessa forma, este projeto se insere no contexto de modernização das ferramentas de transparência pública, buscando utilizar recursos computacionais para reduzir barreiras técnicas e ampliar o acesso da população às informações governamentais.
FUNDAMENTAÇÃO TEÓRICA
A transparência pública está diretamente relacionada aos princípios da publicidade e do acesso à informação presentes na administração pública brasileira. Segundo a Lei de Acesso à Informação, os órgãos públicos devem disponibilizar dados de interesse coletivo de maneira clara, acessível e compreensível.
No entanto, a efetividade da transparência depende não apenas da publicação dos dados, mas também da capacidade da população de interpretá-los corretamente. Esse conceito está associado à transparência efetiva, que busca garantir não somente acesso, mas também compreensão das informações disponibilizadas.
Outro conceito relevante para este trabalho é o de usabilidade, definido por Nielsen (1993) como a facilidade com que usuários conseguem utilizar um sistema para atingir seus objetivos. Em sistemas públicos, a usabilidade influencia diretamente a capacidade dos cidadãos de localizar e compreender informações governamentais.
Além disso, a visualização de dados desempenha papel importante na simplificação de informações complexas. Gráficos, indicadores e rankings podem facilitar a interpretação de grandes volumes de dados públicos, permitindo identificar padrões e tendências de maneira mais intuitiva.
A Inteligência Artificial, especialmente por meio do Processamento de Linguagem Natural (PLN), também constitui base teórica relevante para este projeto. Modelos de linguagem modernos são capazes de interpretar perguntas em linguagem natural e gerar respostas contextualizadas, aproximando sistemas computacionais da comunicação humana.
Nesse sentido, a integração com a API da OpenAI permitirá que o sistema funcione como um mecanismo de apoio educacional e interpretativo, explicando termos técnicos e informações financeiras diretamente na interface do usuário.
Por fim, o conceito de acessibilidade informacional fundamenta a proposta do projeto, buscando garantir que informações públicas possam ser compreendidas não apenas por especialistas, mas também por cidadãos comuns, estudantes e jornalistas.
MATERIAIS E MÉTODOS
O presente trabalho caracteriza-se como uma pesquisa aplicada, de natureza experimental e descritiva, envolvendo o desenvolvimento e avaliação de um sistema computacional voltado à interpretação de dados públicos municipais.
Inicialmente, será selecionado um município como estudo de caso, considerando critérios como disponibilidade dos dados, acessibilidade do portal da transparência e estrutura das informações disponibilizadas.
A coleta dos dados será realizada por meio de técnicas de extração automatizada de informações públicas, utilizando APIs, arquivos CSV, tabelas HTML e, quando necessário, técnicas de web scraping. Para isso, serão utilizadas ferramentas desenvolvidas em linguagem Python, com apoio das bibliotecas Requests, BeautifulSoup e Pandas.
Os dados coletados serão armazenados em banco de dados estruturado, passando por um processo de padronização para corrigir inconsistências de formatos, datas, nomenclaturas e categorias administrativas.
O sistema web será desenvolvido utilizando tecnologias modernas de desenvolvimento frontend e backend. A interface terá foco em simplicidade e acessibilidade, apresentando informações organizadas por meio de tabelas, gráficos e indicadores visuais.
O principal diferencial do sistema será a implementação de uma funcionalidade interativa baseada em Inteligência Artificial. O usuário poderá clicar em um botão de ajuda (“?”) e selecionar qualquer informação exibida na tela para receber uma explicação simplificada gerada automaticamente pela API da OpenAI.
Essa funcionalidade atuará como um “dicionário inteligente”, permitindo que termos técnicos relacionados à administração pública sejam traduzidos para uma linguagem acessível ao cidadão comum.
Para avaliação da ferramenta, serão realizados testes de usabilidade com um grupo de participantes composto por estudantes, cidadãos e usuários sem conhecimento técnico na área pública. Serão aplicados questionários e observações diretas durante o uso do sistema.
Também será realizada uma comparação entre o tempo necessário para compreender determinadas informações utilizando o portal oficial da transparência e utilizando o sistema desenvolvido, buscando avaliar ganhos de acessibilidade, compreensão e eficiência.
A análise dos resultados será conduzida de forma quantitativa e qualitativa, considerando métricas de usabilidade, compreensão das informações e percepção dos usuários em relação à utilidade da ferramenta.

O usuário clica no botão ? na barra superior.
O cursor muda para um indicador de seleção ("Clique em um elemento para entender").
O usuário clica em qualquer componente da tela (gráfico, valor, título, tabela, fornecedor...).
Abre uma lateral chamada Dicionário.
A lateral possui duas abas:
🤖 IA (explicação contextual daquele elemento)
📚 Conceitos (dicionário fixo de termos da administração pública)

┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ Sistema de Transparência Pública                                        Município ▼    (?)   │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│  Gastos Públicos - Exercício 2026                                                            │
│                                                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │ Total Gasto    │  │ Saúde          │  │ Educação       │  │ Obras          │             │
│  │ R$ 24.512.000  │  │ R$ 9.200.000   │  │ R$ 7.800.000   │  │ R$ 3.400.000   │             │
│  └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘             │
│                                                                                              │
│ ┌──────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │                  Gráfico de Gastos por Secretaria                                        │ │
│ └──────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                              │
│ Últimas Despesas                                                                             │
│                                                                                              │
│ Data        Secretaria       Fornecedor             Valor                                    │
│ 15/06/2026  Saúde            ABC Medicamentos      R$ 12.350                                │
│ 14/06/2026  Obras            Construtora Silva     R$ 95.000                                │
│ 13/06/2026  Educação         Papelaria Alfa        R$ 2.410                                 │
│                                                                                              │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ © 2026 Sistema de Transparência Pública Inteligente - Trabalho de Conclusão de Curso         │
└──────────────────────────────────────────────────────────────────────────────────────────────┘

Ao clicar no botão ?

A tela fica assim:

(?) Modo Dicionário ativado

Clique em qualquer informação da tela para entender seu significado.

Quando o usuário clicar, por exemplo, em "R$ 24.512.000", abre a lateral.

aba explicação:
┌───────────────────────────────────────────────────┐
│ DICIONÁRIO                        X      │
├───────────────────────────────────────────────────┤
│                                          │
│  [ 🤖 Explicação ] [ 📚 Conceitos ]      │
│                                          │
├───────────────────────────────────────────────────┤
│                                          │
│ Você selecionou:                      │
│                                       │
│ Total de Gastos                       │
│                                       │
│ Este valor representa a soma de todas │
│ as despesas realizadas pelo município │
│ durante o período selecionado.        │
│                                       │
│ Ele inclui despesas com saúde,        │
│ educação, infraestrutura, pessoal,    │
│ manutenção e demais serviços públicos.│
│                                       │
│───────────────────────────────────────│
│                                       │
│ Deseja entender outro item?           │
│ Clique em qualquer elemento da tela.  │
│                                       │
└───────────────────────────────────────┘

aba conceitos:
┌───────────────────────────────────────┐
│ DICIONÁRIO                        X    │
├───────────────────────────────────────┤
│                                       │
│ [ 🤖 Explicação ] [ 📚 Conceitos ]    │
│                                       │
├───────────────────────────────────────┤
│ 🔎 Pesquisar conceito...              │
│                                       │
│ • Empenho                             │
│ • Liquidação                          │
│ • Pagamento                           │
│ • Dotação Orçamentária                │
│ • Restos a Pagar                      │
│ • Receita                             │
│ • Despesa                             │
│ • Convênio                            │
│ • Licitação                           │
│ • Fornecedor                          │
│ • Contrato                            │
│ • Fonte de Recurso                    │
│                                       │
└───────────────────────────────────────┘

ao clicar por exemplo em "empenho":
Empenho

É a reserva do orçamento para garantir que
o dinheiro esteja disponível para realizar
uma determinada despesa.

Exemplo:

Se a prefeitura vai comprar medicamentos,
primeiro ela realiza o empenho para reservar
o recurso antes do pagamento.

Entrou no sistema

↓

Visualizou os dados

↓

Não entendeu um termo

↓

Clicou no botão ?

↓

Modo Dicionário ativado

↓

Clicou em qualquer item da tela

↓

Abriu a lateral

↓

Leu a explicação da IA

↓

Fechou a lateral ou pesquisou outros conceitos

Esse fluxo reforça a proposta do TCC: o cidadão permanece na mesma tela de transparência, sem precisar navegar para outra página ou abrir um chat separado. A IA atua apenas como um mecanismo de apoio contextual, enquanto a aba de Conceitos oferece um glossário permanente para consultas rápidas, mesmo sem depender da IA. Isso deixa a solução simples, intuitiva e claramente voltada à melhoria da compreensão das informações públicas.