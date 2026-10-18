export interface SecaoArtigo {
  subtitulo: string;
  paragrafos: string[];
  pontosChave?: string[];
}

export interface ArtigoEmpreendedorismo {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  categoria: 'Início de Negócio' | 'MEI & Legalização' | 'Finanças' | 'Marketing';
  tempoLeitura: string;
  data: string;
  secoes: SecaoArtigo[];
  conclusaoPratica: string;
  avisoLegal?: string;
}

export const ARTIGOS_EMPREENDEDORISMO: ArtigoEmpreendedorismo[] = [
  {
    id: 'art-01',
    slug: 'primeiros-passos-para-abrir-um-negocio',
    titulo: 'Primeiros Passos para Tirar uma Ideia do Papel com Segurança',
    resumo: 'Aprenda como validar sua ideia no mercado, identificar clientes reais e iniciar sua jornada sem comprometer seu patrimônio pessoal.',
    categoria: 'Início de Negócio',
    tempoLeitura: '6 min de leitura',
    data: '18/10/2026',
    secoes: [
      {
        subtitulo: '1. O Problema que Você Realmente Resolve',
        paragrafos: [
          'Muitos novos empreendedores começam apaixonados pela sua própria solução técnica ou produto, esquecendo-se de analisar se existe uma dor real pela qual as pessoas estão dispostas a pagar.',
          'Antes de investir economias em estoque, marca ou ponto comercial, converse diretamente com pelo menos 15 a 20 potenciais clientes. Identifique como eles resolvem essa necessidade hoje e quanto gastam com isso.'
        ],
        pontosChave: [
          'Entreviste potenciais compradores antes de comprar equipamentos ou insumos.',
          'Mapeie alternativas existentes no mercado e identifique o diferencial do seu atendimento ou entrega.'
        ]
      },
      {
        subtitulo: '2. Criando uma Versão Mínima Viável (MVP)',
        paragrafos: [
          'Em vez de tentar construir a operação perfeita desde o primeiro dia, lance uma versão simplificada do seu serviço ou lote reduzido de produtos.',
          'Essa abordagem reduz drasticamente o risco financeiro e permite coletar feedback real rapidamente, ajustando o rumo sem frustrações.'
        ]
      }
    ],
    conclusaoPratica: 'Defina hoje um produto ou serviço enxuto e faça sua primeira oferta para um grupo restrito de pessoas nos próximos 7 dias.',
    avisoLegal: 'Este material tem caráter estritamente educativo e não substitui consultoria jurídica ou contábil especializada.'
  },
  {
    id: 'art-02',
    slug: 'guia-definitivo-do-mei',
    titulo: 'Tudo o que Você Precisa Saber Antes e Depois de Abrir um MEI',
    resumo: 'Compreenda limites de faturamento, direitos previdenciários, obrigações mensais do DAS e a importância de manter a regularidade fiscal.',
    categoria: 'MEI & Legalização',
    tempoLeitura: '5 min de leitura',
    data: '18/10/2026',
    secoes: [
      {
        subtitulo: '1. O Que É o MEI e Quem Pode se Enquadrar',
        paragrafos: [
          'O Microempreendedor Individual é o modelo mais acessível e simplificado de formalização no Brasil, criado para tirar autônomos da informalidade com carga tributária reduzida e fixa.',
          'É fundamental verificar se sua atividade econômica pretendida (CNAE) consta na lista oficial de ocupações permitidas e se seu faturamento anual estimado se mantém dentro do teto vigente.'
        ],
        pontosChave: [
          'Não ser sócio, titular ou administrador de outra empresa ativa.',
          'Permite a contratação de no máximo um colaborador registrado recebendo o piso da categoria ou salário mínimo.'
        ]
      },
      {
        subtitulo: '2. A Disciplina do DAS Mensal',
        paragrafos: [
          'O pagamento mensal do Documento de Arrecadação do Simples Nacional (DAS) é a única obrigação fiscal periódica fixa do MEI e garante acesso a benefícios previdenciários como aposentadoria e auxílio-doença.',
          'O pagamento deve ocorrer todo mês, inclusive quando a empresa não registrar vendas ou faturamento.'
        ]
      }
    ],
    conclusaoPratica: 'Mantenha um alarme mensal fixo para emissão e quitação do DAS e guarde todos os comprovantes arquivados por no mínimo 5 anos.',
    avisoLegal: 'As regras tributárias e os limites do Simples Nacional estão sujeitos a alterações legislativas periódicas. Consulte os portais governamentais oficiais.'
  },
  {
    id: 'art-03',
    slug: 'separacao-de-contas-e-pro-labore',
    titulo: 'Como Separar Dinheiro Pessoal do Negócio e Definir seu Pró-Labore',
    resumo: 'Evite a principal causa de mortalidade precoce de empresas: a confusão patrimonial entre a pessoa física e a pessoa jurídica.',
    categoria: 'Finanças',
    tempoLeitura: '7 min de leitura',
    data: '18/10/2026',
    secoes: [
      {
        subtitulo: '1. A Armadilha da Conta Única',
        paragrafos: [
          'Pagar despesas da casa usando a conta da empresa ou pagar fornecedores da empresa pelo cartão pessoal distorce completamente o lucro real do negócio.',
          'O primeiro passo prático de profissionalização é abrir uma conta bancária PJ separada (mesmo gratuita) e canalizar todos os recebimentos e despesas operacionais exclusivamente através dela.'
        ]
      },
      {
        subtitulo: '2. Como Estipular o Pró-Labore',
        paragrafos: [
          'O pró-labore é a remuneração pelo trabalho do dono na operação do negócio e deve constar como um custo operacional previsível.',
          'O valor deve ser estipulado com base no mercado para a função desempenhada e na capacidade financeira da empresa, transferido em dia fixo para a conta pessoal.'
        ],
        pontosChave: [
          'Defina um valor fixo de retirada mensal condizente com a receita da empresa.',
          'Apenas o que sobrar após todas as despesas, pró-labore e reserva de emergência é lucro retido ou distribuível.'
        ]
      }
    ],
    conclusaoPratica: 'Abra sua conta PJ esta semana e estabeleça uma data única por mês para transferir seu pró-labore fixo para a conta física.',
    avisoLegal: 'Orientações financeiras gerais. Não constituem consultoria financeira individualizada nem planejamento tributário específico.'
  },
  {
    id: 'art-04',
    slug: 'marketing-local-e-primeiros-clientes',
    titulo: 'Marketing para Pequenos Negócios: Atraindo Clientes Sem Grandes Verbas',
    resumo: 'Estratégias de presença digital, posicionamento em mapas locais e técnicas de indicação para construir tração inicial.',
    categoria: 'Marketing',
    tempoLeitura: '6 min de leitura',
    data: '18/10/2026',
    secoes: [
      {
        subtitulo: '1. Dominando a Busca Local',
        paragrafos: [
          'A maior parte das pessoas busca serviços na sua própria região através do smartphone. Estar cadastrado e atualizado em plataformas de mapas locais é o meio mais rápido de ser encontrado de graça.',
          'Mantenha fotos reais do seu trabalho, horário de atendimento, telefone com WhatsApp para contato rápido e solicite ativamente avaliações aos clientes satisfeitos.'
        ]
      },
      {
        subtitulo: '2. O Poder da Indicação Estruturada',
        paragrafos: [
          'Boca a boca não precisa ser deixado ao acaso. Você pode criar um programa de indicação simples oferecendo vantagens, descontos ou mimos exclusivos para clientes que indicarem novos clientes.',
          'Parcerias com outros pequenos comerciantes do seu bairro que atendem o mesmo público, mas não competem diretamente, geram resultados expressivos.'
        ]
      }
    ],
    conclusaoPratica: 'Atualize hoje seu perfil de busca local e envie uma mensagem de agradecimento com pedido de avaliação para seus últimos 5 clientes atendidos.'
  },
  {
    id: 'art-05',
    slug: 'reserva-de-emergencia-e-capital-de-giro',
    titulo: 'Capital de Giro e Reserva Financeira: O Fôlego da sua Empresa',
    resumo: 'Entenda a diferença entre o dinheiro necessário para rodar o dia a dia e o colchão de proteção para meses de baixa.',
    categoria: 'Finanças',
    tempoLeitura: '5 min de leitura',
    data: '18/10/2026',
    secoes: [
      {
        subtitulo: '1. Entendendo o Ciclo Financeiro',
        paragrafos: [
          'Muitas empresas que vendem bem quebram por falta de capital de giro. Isso acontece quando você paga fornecedores à vista e recebe dos clientes a prazo (como no cartão de crédito em parcelas).',
          'O capital de giro é o montante necessário para honrar compromissos operacionais enquanto o dinheiro das vendas ainda não caiu na conta corrente.'
        ]
      },
      {
        subtitulo: '2. Construindo a Reserva Passo a Passo',
        paragrafos: [
          'A meta recomendada para pequenos negócios é acumular o equivalente a 3 a 6 meses de custos fixos operacionais guardados em aplicação com liquidez diária e baixo risco.',
          'Não é necessário atingir esse valor de uma vez: reserve de 5% a 10% do faturamento líquido mensal até compor o montante protetor.'
        ]
      }
    ],
    conclusaoPratica: 'Calcule o valor exato dos seus custos fixos mensais e inicie este mês uma reserva separada aportando pelo menos 5% das receitas.',
    avisoLegal: 'Conteúdo informativo. As decisões de alocação de capital devem considerar a realidade específica e o fluxo de caixa de cada empresa.'
  }
];
