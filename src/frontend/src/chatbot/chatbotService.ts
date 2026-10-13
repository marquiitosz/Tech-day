import type { ChatMessage, ChatbotResponse } from './types';

const SESSION_STORAGE_KEY = 'empreenda_facil_chatbot_history_v1';
const MAX_MESSAGE_LENGTH = 500;

// Palavras-chave associadas a negócios e empreendedorismo para guarda local
const BUSINESS_KEYWORDS = [
  'empreender', 'empreendedor', 'empreendedora', 'empreendedorismo', 'negócio', 'negocio',
  'empresa', 'abrir empresa', 'mei', 'microempresa', 'cnpj', 'faturamento', 'lucro',
  'capital de giro', 'investimento', 'sócio', 'socio', 'sociedade', 'plano de negócios',
  'plano de negócio', 'canvas', 'proposta de valor', 'cliente', 'público-alvo', 'publico alvo',
  'marketing', 'vendas', 'conversão', 'precificação', 'preço', 'custo', 'despesa',
  'fluxo de caixa', 'startup', 'mvp', 'validação', 'mercado', 'concorrente', 'concorrência',
  'gestão', 'liderança', 'finanças', 'tributo', 'simples nacional', 'nota fiscal',
  'contrato', 'estoque', 'fornecedor', 'serviço', 'produto', 'escala', 'ponto de equilíbrio',
  'break-even', 'marketing digital', 'tráfego', 'ideia', 'começar', 'trabalho', 'renda',
  'lucratividade', 'margem', 'inovação', 'pitch', 'investidor', 'b2b', 'b2c'
];

// Sanitiza a mensagem do usuário (remove tags HTML, caracteres de controle e limita tamanho)
export function sanitizeUserInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // remove potenciais tags
    .trim()
    .slice(0, MAX_MESSAGE_LENGTH);
}

// Verifica se o assunto tem relação com empreendedorismo
export function isEntrepreneurshipRelated(text: string): boolean {
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (normalized.length < 3) return false;

  // Saudações comuns são aceitas no contexto inicial
  const greetings = ['ola', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'ajuda', 'socorro', 'como funciona'];
  if (greetings.some((g) => normalized.startsWith(g) || normalized === g)) {
    return true;
  }

  return BUSINESS_KEYWORDS.some((kw) => {
    const kwNorm = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalized.includes(kwNorm);
  });
}

// Respostas inteligentes locais caso o backend não esteja ativo
function getLocalKnowledgeReply(cleanedMessage: string): string {
  const norm = cleanedMessage
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (/^(ola|oi|bom dia|boa tarde|boa noite)/.test(norm)) {
    return 'Olá! Sou a Verity IA, sua assistente no EmpreendaFácil. Estou aqui para te ajudar em tudo sobre empreendedorismo, abertura de empresas, planejamento financeiro e estratégias de negócio. O que você gostaria de explorar hoje?';
  }

  if (norm.includes('mei') || norm.includes('abrir')) {
    return 'Para abrir um MEI (Microempreendedor Individual), o processo é gratuito pelo Portal do Empreendedor (gov.br). Os requisitos principais são: faturamento até R$ 81.000/ano, não ter participação em outra empresa e exercer uma atividade permitida. Você precisa de auxílio para escolher sua atividade ou entender os custos mensais (DAS)?';
  }

  if (norm.includes('plano') || norm.includes('canvas')) {
    return 'Um bom Plano de Negócios começa pela definição da sua Proposta de Valor: qual dor do cliente você resolve? Em seguida, estruture: 1) Segmento de Clientes, 2) Fontes de Receita, 3) Estrutura de Custos e 4) Canais de Venda. O Modelo Business Model Canvas é uma ótima ferramenta visual para iniciar!';
  }

  if (norm.includes('preco') || norm.includes('precificacao') || norm.includes('cobrar')) {
    return 'Para precificar corretamente: some os Custos Diretos (matéria-prima, produto) + Custos Indiretos proporcionais (aluguel, luz) + Impostos + a sua Margem de Lucro desejada. Não se esqueça de pesquisar a média do mercado para manter seu preço competitivo.';
  }

  if (norm.includes('cliente') || norm.includes('marketing') || norm.includes('venda')) {
    return 'Para atrair clientes: 1) Defina seu Perfil de Cliente Ideal (ICP); 2) Esteja onde eles estão (redes sociais, Google Meu Negócio, parcerias); 3) Foque em produzir conteúdo que eduque e resolva problemas antes de vender diretamente. Qual é o seu segmento de mercado?';
  }

  if (norm.includes('caixa') || norm.includes('financa') || norm.includes('dinheiro')) {
    return 'A regra de ouro nas finanças empresariais é: NUNCA misture as contas pessoais com as da empresa. Mantenha um fluxo de caixa diário registrando todas as entradas e saídas e reserve um capital de giro para imprevistos dos primeiros meses.';
  }

  return 'Excelente pergunta sobre negócios! O empreendedorismo exige validação constante: converse com potenciais clientes, teste um protótipo ou versão inicial (MVP) do seu produto/serviço e meça o interesse real antes de investir altos valores. Em qual etapa seu projeto está atualmente?';
}

// Comunicação principal: tenta backend e cai no fallback inteligente
export async function sendMessageToChatbot(userMessage: string): Promise<ChatbotResponse> {
  const sanitized = sanitizeUserInput(userMessage);

  if (!sanitized) {
    return {
      reply: 'Por favor, digite uma mensagem para que eu possa te ajudar.',
      outOfScope: false,
    };
  }

  // Verificação estrita de escopo
  if (!isEntrepreneurshipRelated(sanitized)) {
    return {
      reply: 'Sou a Verity IA e sou especializada exclusivamente em empreendedorismo e gestão de negócios. Posso tirar dúvidas sobre abertura de empresas, MEI, finanças, planos de negócios, marketing e vendas. Como posso apoiar seu projeto ou negócio hoje?',
      outOfScope: true,
    };
  }

  const endpoint =
    (import.meta.env?.VITE_CHATBOT_API_URL as string | undefined) ||
    'http://localhost:3000/api/chatbot/message';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: sanitized }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (typeof data.reply === 'string') {
        return {
          reply: data.reply,
          outOfScope: Boolean(data.outOfScope),
        };
      }
    }
  } catch {
    // Se o backend não estiver rodando ou der timeout, usa o motor local seguro
  }

  // Fallback com base de conhecimento especializada
  return {
    reply: getLocalKnowledgeReply(sanitized),
    outOfScope: false,
  };
}

// Gerenciamento de histórico de sessão
export function loadChatHistory(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as ChatMessage[];
    }
  } catch {
    // Caso ocorra erro de parsing, ignora
  }
  return [];
}

export function saveChatHistory(messages: ChatMessage[]): void {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Ignora se o storage estiver bloqueado ou cheio
  }
}

export function clearChatHistory(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Ignora
  }
}

let messageCounter = 0;

export function generateMessageId(prefix: string): string {
  messageCounter += 1;
  return `${prefix}_${Date.now()}_${messageCounter}`;
}

export function getCurrentTimestamp(): number {
  return Date.now();
}

