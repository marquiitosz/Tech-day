import { Router, Request, Response } from 'express';

export const chatbotRouter = Router();

// Carrega automaticamente o .env no Node.js v20+ se disponível
if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile();
  } catch {
    // Arquivo .env já carregado ou ausente
  }
}

const BUSINESS_KEYWORDS = [
  'empreender', 'empreendedor', 'empreendedora', 'empreendedorismo', 'negócio', 'negocio',
  'empresa', 'abrir empresa', 'mei', 'microempresa', 'cnpj', 'faturamento', 'lucro',
  'capital de giro', 'investimento', 'sócio', 'socio', 'sociedade', 'plano de negócios',
  'plano de negócio', 'canvas', 'proposta de valor', 'cliente', 'público-alvo', 'publico alvo',
  'marketing', 'vendas', 'conversão', 'precificação', 'preço', 'custo', 'despesa',
  'fluxo de caixa', 'startup', 'mvp', 'validação', 'mercado', 'concorrente', 'concorrência',
  'gestão', 'liderança', 'finanças', 'tributo', 'simples nacional', 'nota fiscal',
  'contrato', 'estoque', 'fornecedor', 'serviço', 'produto', 'escala', 'ponto de equilíbrio'
];

function isEntrepreneurshipRelated(text: string): boolean {
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const greetings = ['ola', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'ajuda', 'como funciona'];
  if (greetings.some((g) => normalized.startsWith(g) || normalized === g)) {
    return true;
  }

  return BUSINESS_KEYWORDS.some((kw) => {
    const kwNorm = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalized.includes(kwNorm);
  });
}

function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[<>]/g, '').trim().slice(0, 500);
}

chatbotRouter.post('/message', async (req: Request, res: Response) => {
  try {
    const rawMessage = req.body?.message;
    const cleanMessage = sanitizeText(rawMessage);

    if (!cleanMessage) {
      return res.status(400).json({
        error: 'Mensagem vazia ou inválida.',
        reply: 'Por favor, digite uma mensagem válida.',
      });
    }

    // Regra estrita de escopo
    if (!isEntrepreneurshipRelated(cleanMessage)) {
      return res.json({
        reply: 'Sou a Verity IA e sou especializada exclusivamente em empreendedorismo e gestão de negócios. Posso esclarecer dúvidas sobre formalização de empresas (MEI, ME), controle financeiro, estratégias de vendas, marketing e elaboração de planos de negócios. Como posso ajudar com seu negócio hoje?',
        outOfScope: true,
      });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const geminiModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

    // 1. Integração com Google Gemini
    if (geminiKey) {
      try {
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`;
        const response = await fetch(geminiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [
                {
                  text: 'Você é a Verity IA, a especialista e assistente virtual de negócios do EmpreendaFácil. Seu tom deve ser estritamente profissional, amigável, encorajador e prático. Seu idioma é o Português do Brasil. Regra inegociável: você só pode responder a dúvidas estritamente ligadas a empreendedorismo, finanças de negócios, empresas, MEI, marketing e gestão. Se o usuário perguntar sobre qualquer outro assunto fora de negócios, recuse educadamente e direcione para empreendedorismo.',
                },
              ],
            },
            contents: [
              {
                role: 'user',
                parts: [{ text: cleanMessage }],
              },
            ],
            generationConfig: {
              maxOutputTokens: 500,
              temperature: 0.7,
            },
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as {
            candidates?: Array<{
              content?: {
                parts?: Array<{ text?: string }>;
              };
            }>;
          };

          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return res.json({
              reply: generatedText,
              outOfScope: false,
            });
          }
        } else {
          const errText = await response.text();
          console.error('Erro na resposta do Google Gemini:', errText);
        }
      } catch (err) {
        console.error('Erro de conexão com Google Gemini:', err);
      }
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';

    // 2. Integração com Anthropic (Claude)
    if (apiKey) {
      try {
        const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model,
            max_tokens: 400,
            system:
              'Você é o assistente virtual do EmpreendaFácil. Seu tom deve ser estritamente profissional, amigável, encorajador e prático. Seu idioma é o Português do Brasil. Regra inegociável: você só pode responder a dúvidas estritamente ligadas a empreendedorismo, finanças de negócios, empresas, MEI, marketing e gestão. Se o usuário perguntar sobre qualquer outro assunto, recuse educadamente e direcione para empreendedorismo.',
            messages: [{ role: 'user', content: cleanMessage }],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json() as {
            content?: Array<{ type: string; text: string }>;
          };
          const textBlock = aiData.content?.find((c) => c.type === 'text');
          if (textBlock?.text) {
            return res.json({
              reply: textBlock.text,
              outOfScope: false,
            });
          }
        }
      } catch (err) {
        console.error('Erro ao chamar API de IA no backend:', err);
      }
    }

    // Resposta padrão especializada quando a chave de IA não está presente
    let reply = 'Excelente ponto sobre o mundo dos negócios! No empreendedorismo, manter a disciplina financeira, conhecer profundamente as necessidades do seu cliente e validar suas hipóteses com um Produto Mínimo Viável (MVP) são passos fundamentais para o sucesso sustentável.';

    const lower = cleanMessage.toLowerCase();
    if (lower.includes('mei')) {
      reply = 'O MEI (Microempreendedor Individual) é ideal para quem fatura até R$ 81 mil/ano e precisa emitir notas fiscais com custo tributário simplificado e reduzido (taxa mensal fixa DAS). Você pode se formalizar gratuitamente pelo gov.br.';
    } else if (lower.includes('plano') || lower.includes('canvas')) {
      reply = 'Para estruturar seu Plano de Negócios, defina claramente: 1) Segmento de clientes; 2) Proposta de valor; 3) Canais de entrega; 4) Estrutura de custos; 5) Fontes de receita. Utilizar o Business Model Canvas acelera muito essa visualização.';
    } else if (lower.includes('preco') || lower.includes('precificar')) {
      reply = 'Para formar o preço de venda de forma saudável: Custos Variáveis + Custos Fixos proporcionais + Impostos + Margem de Lucro desejada. Lembre-se também de comparar o valor percebido pelo cliente em relação aos concorrentes.';
    }

    return res.json({
      reply,
      outOfScope: false,
    });
  } catch (error) {
    console.error('Erro interno no chatbot:', error);
    return res.status(500).json({
      error: 'Erro ao processar mensagem.',
      reply: 'Desculpe, ocorreu uma instabilidade momentânea. Por favor, tente novamente.',
    });
  }
});
