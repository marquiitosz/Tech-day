import { useState } from 'react';

interface ModuloConteudo {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  tempo: string;
  nivel: string;
  tipo: string;
  destaque: boolean;
  resumo: string;
  topicosClave: string[];
  passoAPasso: string[];
  dicaOuro: string;
}

const MOCK_CONTEUDOS: ModuloConteudo[] = [
  {
    id: 1,
    titulo: 'Fluxo de Caixa Descomplicado para Iniciantes',
    descricao: 'Aprenda a controlar entradas e saídas do seu negócio sem complicações usando planilhas simples.',
    categoria: 'Financeiro',
    tempo: '15 min de leitura',
    nivel: 'Iniciante',
    tipo: 'Artigo',
    destaque: true,
    resumo: 'O fluxo de caixa é a espinha dorsal de qualquer empreendimento. Registar diariamente o dinheiro que entra e sai evita surpresas e garante a liquidez necessária para manter a empresa operacional.',
    topicosClave: [
      'Registo diário e categorizado de receitas e despesas',
      'Separação rigorosa entre contas pessoais e empresariais',
      'Projeção de pagamentos e recebimentos futuros'
    ],
    passoAPasso: [
      'Anote diariamente todas as entradas de vendas e saídas de custos.',
      'Separe as despesas em Fixas (renda, internet) e Variáveis (matéria-prima, taxas).',
      'Calcule o saldo diário e verifique se há excedente ou défice.',
      'Projete as despesas do próximo mês para prever necessidades de capital.'
    ],
    dicaOuro: 'Nunca misture a sua conta bancária pessoal com a conta da empresa. Defina um pró-labore fixo para si mesmo.'
  },
  {
    id: 2,
    titulo: 'Como Formar o Preço de Venda do seu Produto/Serviço',
    descricao: 'Descubra como calcular margem de lucro, custos fixos e variáveis para não ter prejuízo.',
    categoria: 'Financeiro',
    tempo: '25 min de aula',
    nivel: 'Intermediário',
    tipo: 'Vídeo',
    destaque: false,
    resumo: 'Precificar de forma incorreta pode destruir a margem do negócio. Este módulo ensina a somar todos os custos operacionais e aplicar o markup correto para garantir lucratividade.',
    topicosClave: [
      'Cálculo de custos diretos e indiretos',
      'Compreensão do conceito de Margem de Contribuição',
      'Análise da concorrência sem comprometer os custos'
    ],
    passoAPasso: [
      'Mapeie o custo direto unitário de produção ou prestação do serviço.',
      'Calcule a percentagem de custos fixos que cada unidade deve cobrir.',
      'Defina a margem de lucro líquida desejada para o seu setor.',
      'Aplique a fórmula do Markup para obter o preço de venda final.'
    ],
    dicaOuro: 'Não baixe o seu preço apenas para cobrir a concorrência se isso significar trabalhar com margem negativa.'
  },
  {
    id: 3,
    titulo: 'Estratégias de Marketing Digital sem Gastar Nada',
    descricao: 'Como usar redes sociais, SEO local e marketing de conteúdo para atrair seus primeiros clientes.',
    categoria: 'Marketing',
    tempo: '20 min de leitura',
    nivel: 'Iniciante',
    tipo: 'Guia',
    destaque: true,
    resumo: 'Não precisa de grandes orçamentos para atrair os primeiros clientes. Utilizando ferramentas gratuitas e estratégias de conteúdo, é possível criar presença digital e gerar autoridade.',
    topicosClave: [
      'Otimização do perfil no Google Meu Negócio',
      'Criação de conteúdo focado na resolução de problemas do cliente',
      'Parcerias de divulgação e prova social'
    ],
    passoAPasso: [
      'Crie e otimize a sua ficha no Google Meu Negócio com fotos e horários.',
      'Mapeie as 5 principais dúvidas dos seus clientes e crie publicações a responder-lhes.',
      'Peça avaliações com 5 estrelas aos seus clientes satisfeitos.',
      'Realize parcerias estratégicas com empreendedores de nichos complementares.'
    ],
    dicaOuro: 'A constância na publicação de conteúdos de valor supera a perfeição técnica na edição.'
  },
  {
    id: 4,
    titulo: 'Guia Prático para Formalização MEI',
    descricao: 'Passo a passo completo sobre direitos, deveres, emissão de nota fiscal e pagamento do DAS.',
    categoria: 'Gestão',
    tempo: '10 min de leitura',
    nivel: 'Iniciante',
    tipo: 'Guia',
    destaque: false,
    resumo: 'A formalização traz segurança jurídica, direito a benefícios previdenciários e abertura de portas para vender a outras empresas através de nota fiscal.',
    topicosClave: [
      'Requisitos e limites de faturamento anual do MEI',
      'Obrigação e vencimento mensal do boleto DAS',
      'Passos para emissão de Nota Fiscal de Serviços/Vendas'
    ],
    passoAPasso: [
      'Aceda ao Portal do Empreendedor oficial do governo.',
      'Insira os dados pessoais e escolha a atividade (CNAE) adequada.',
      'Gere o seu CNPJ e guarde o Certificado CCMEI.',
      'Registe-se na prefeitura ou sistema estadual para emitir notas fiscais.'
    ],
    dicaOuro: 'Pague a guia DAS mensalmente no dia correto, mesmo em meses onde não houver faturamento.'
  },
  {
    id: 5,
    titulo: 'Técnicas de Vendas e Objeções dos Clientes',
    descricao: 'Aprenda a contornar "está caro" e feche mais negócios com técnicas testadas de persuasão.',
    categoria: 'Vendas',
    tempo: '30 min de aula',
    nivel: 'Intermediário',
    tipo: 'Vídeo',
    destaque: false,
    resumo: 'Vender é um processo de escuta e resolução de problemas. Quando o cliente diz que algo "está caro", na verdade significa que ainda não percebeu o valor real do produto.',
    topicosClave: [
      'Metodologia de Escuta Ativa e Investigação das Dores',
      'Ancoragem de valor antes da apresentação do preço',
      'Contorno pragmático das 4 objeções clássicas'
    ],
    passoAPasso: [
      'Faça perguntas abertas para entender a real necessidade do potencial cliente.',
      'Apresente os benefícios diretos do produto antes de falar do investimento.',
      'Quando o cliente objetar pelo preço, isole a objeção: "Se o preço couber no orçamento, fechamos hoje?"',
      'Apresente opções de parcelamento ou ajuste o escopo do produto/serviço.'
    ],
    dicaOuro: 'Preço é o que o cliente paga; valor é o conjunto de benefícios que ele percebe que recebe.'
  },
  {
    id: 6,
    titulo: 'Como Criar uma Proposta Comercial Irresistível',
    descricao: 'Modelos e estruturas para apresentar seus serviços de forma profissional e aumentar sua conversão.',
    categoria: 'Vendas',
    tempo: '12 min de leitura',
    nivel: 'Avançado',
    tipo: 'Template',
    destaque: false,
    resumo: 'Uma proposta bem estruturada alinha expectativas, passa profissionalismo e elimina margens para dúvidas no momento de fechar o contrato.',
    topicosClave: [
      'Estruturação em blocos: Problema, Solução, Escopo e Investimento',
      'Apresentação em formato de planos (Básico, Recomendado, Premium)',
      'Definição clara de prazos, termos de garantia e validade'
    ],
    passoAPasso: [
      'Inicie a proposta resumindo o problema atual relatado pelo cliente.',
      'Apresente o plano de ação detalhado com os respetivos entregáveis.',
      'Apresente 2 a 3 opções de pacotes de investimento para ancorar valor.',
      'Inclua um prazo de validade curto para gerar senso de urgência na resposta.'
    ],
    dicaOuro: 'Apresente sempre a proposta numa reunião rápida (online ou presencial) em vez de apenas enviá-la por e-mail.'
  }
];

const CATEGORIAS = ['Todos', 'Financeiro', 'Marketing', 'Vendas', 'Gestão'];

export default function Conteudos() {
  const [busca, setBusca] = useState<string>('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('Todos');
  const [moduloSelecionado, setModuloSelecionado] = useState<ModuloConteudo | null>(null);

  const conteudosFiltrados = MOCK_CONTEUDOS.filter((item) => {
    const bateCategoria = categoriaSelecionada === 'Todos' || item.categoria === categoriaSelecionada;
    const bateBusca = item.titulo.toLowerCase().includes(busca.toLowerCase()) || 
                      item.descricao.toLowerCase().includes(busca.toLowerCase());
    return bateCategoria && bateBusca;
  });

  return (
    <div className="min-h-screen text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Biblioteca de Conhecimento
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Conteúdos de Empreendedorismo
          </h1>
          <p className="text-slate-400 max-w-2xl text-sm md:text-base">
            Explore materiais práticos, guias e módulos explicativos desenvolvidos para impulsionar a gestão e o crescimento do seu negócio.
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800 backdrop-blur-md">
          <div className="flex flex-wrap gap-2">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaSelecionada(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                  categoriaSelecionada === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Buscar conteúdos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700/60 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Grid de Cards */}
        {conteudosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conteudosFiltrados.map((item) => (
              <article
                key={item.id}
                className="flex flex-col justify-between bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-6 transition duration-200 hover:-translate-y-1 shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {item.categoria}
                    </span>
                    <span className="text-slate-400">{item.tipo}</span>
                  </div>

                  <h2 
                    onClick={() => setModuloSelecionado(item)}
                    className="text-lg font-bold text-white leading-snug hover:text-indigo-300 transition cursor-pointer"
                  >
                    {item.titulo}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.descricao}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span>{item.tempo}</span>
                    <span>•</span>
                    <span className="text-slate-300">{item.nivel}</span>
                  </div>

                  <button 
                    onClick={() => setModuloSelecionado(item)}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
                  >
                    Acessar &rarr;
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            Nenhum conteúdo encontrado para os termos buscados.
          </div>
        )}

        {/* Modal de Conteúdo Detalhado */}
        {moduloSelecionado && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl my-8 relative">
              
              {/* Botão Fechar Modal */}
              <button
                onClick={() => setModuloSelecionado(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-lg transition"
              >
                ✕
              </button>

              {/* Cabeçalho do Módulo */}
              <div className="space-y-2 pr-6">
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {moduloSelecionado.categoria}
                  </span>
                  <span className="text-slate-400">{moduloSelecionado.tipo}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{moduloSelecionado.tempo}</span>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {moduloSelecionado.titulo}
                </h2>
              </div>

              {/* Visão Geral */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-300">
                  Visão Geral do Módulo
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {moduloSelecionado.resumo}
                </p>
              </div>

              {/* Tópicos Chave */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-300">
                  Pontos Principais
                </h3>
                <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                  {moduloSelecionado.topicosClave.map((topico, idx) => (
                    <li key={idx}>{topico}</li>
                  ))}
                </ul>
              </div>

              {/* Passo a Passo */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-300">
                  Plano de Ação (Passo a Passo)
                </h3>
                <ol className="list-decimal list-inside text-sm text-slate-300 space-y-1.5">
                  {moduloSelecionado.passoAPasso.map((passo, idx) => (
                    <li key={idx} className="pl-1">{passo}</li>
                  ))}
                </ol>
              </div>

              {/* Dica de Ouro */}
              <div className="bg-indigo-950/50 border border-indigo-500/30 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
                  Dica de Ouro
                </h4>
                <p className="text-sm text-indigo-200">
                  {moduloSelecionado.dicaOuro}
                </p>
              </div>

              {/* Rodapé da Modal */}
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setModuloSelecionado(null)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition shadow-md shadow-indigo-600/20"
                >
                  Concluir Leitura
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}