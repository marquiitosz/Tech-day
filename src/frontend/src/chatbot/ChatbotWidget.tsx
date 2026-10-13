import React, { useState, useEffect, useRef } from 'react';
import './chatbot.css';
import type { ChatMessage, ChatStatus } from './types';
import {
  sendMessageToChatbot,
  loadChatHistory,
  saveChatHistory,
  clearChatHistory,
  sanitizeUserInput,
  generateMessageId,
  getCurrentTimestamp,
} from './chatbotService';
import { VERITY_AVATAR } from './avatar';

const INITIAL_BOT_MESSAGE: ChatMessage = {
  id: 'msg_welcome',
  sender: 'bot',
  text: 'Olá! Sou a Verity IA, sua especialista em negócios no EmpreendaFácil. Posso te ajudar com dúvidas sobre abertura de empresas, MEI, finanças, planos de negócio e estratégias. Em que posso te ajudar hoje?',
  timestamp: 1700000000000,
};

const QUICK_SUGGESTIONS = [
  'Como abrir MEI?',
  'Como precificar meu serviço?',
  'Como fazer um Plano de Negócios?',
  'Dicas de fluxo de caixa',
];

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = loadChatHistory();
    return saved.length > 0 ? saved : [INITIAL_BOT_MESSAGE];
  });
  const [inputValue, setInputValue] = useState<string>('');
  const [status, setStatus] = useState<ChatStatus>('idle');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Salva no sessionStorage sempre que as mensagens mudarem
  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  // Rola até o final ao receber nova mensagem ou alterar status
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, status, isOpen]);

  // Foco no input ao abrir a janela
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Fechar no Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = sanitizeUserInput(textToSend ?? inputValue);
    if (!text || status === 'typing') return;

    const userMessage: ChatMessage = {
      id: generateMessageId('user'),
      sender: 'user',
      text,
      timestamp: getCurrentTimestamp(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setStatus('typing');

    try {
      const response = await sendMessageToChatbot(text);
      const botMessage: ChatMessage = {
        id: generateMessageId('bot'),
        sender: 'bot',
        text: response.reply,
        timestamp: getCurrentTimestamp(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setStatus('idle');
    } catch {
      const errorMessage: ChatMessage = {
        id: generateMessageId('err'),
        sender: 'system',
        text: 'Desculpe, ocorreu um problema momentâneo ao processar sua dúvida. Por favor, tente novamente.',
        timestamp: getCurrentTimestamp(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
      setStatus('error');
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void handleSendMessage();
  };

  const handleClearHistory = () => {
    clearChatHistory();
    setMessages([INITIAL_BOT_MESSAGE]);
    setStatus('idle');
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Botão Flutuante */}
      <button
        type="button"
        className="cb-floating-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Fechar Verity IA' : 'Abrir Verity IA'}
        aria-expanded={isOpen}
      >
        <span className="cb-floating-badge" />
        {isOpen ? (
          <div className="cb-trigger-close-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        ) : (
          <img
            src={VERITY_AVATAR}
            alt="Verity IA"
            className="cb-trigger-avatar-img"
          />
        )}
      </button>

      {/* Janela de Chat */}
      {isOpen && (
        <section
          className="cb-chat-window"
          role="dialog"
          aria-label="Assistente Virtual Verity IA"
          aria-modal="false"
        >
          {/* Cabeçalho */}
          <header className="cb-header">
            <div className="cb-header-info">
              <div className="cb-avatar-wrapper" aria-hidden="true">
                <img
                  src={VERITY_AVATAR}
                  alt="Avatar da Verity IA"
                  className="cb-avatar-img"
                />
                <span className="cb-avatar-badge" />
              </div>
              <div className="cb-title-box">
                <span className="cb-title">Verity IA</span>
                <span className="cb-subtitle">
                  <span className="cb-status-dot" />
                  Especialista em Negócios
                </span>
              </div>
            </div>

            <div className="cb-header-actions">
              <button
                type="button"
                className="cb-icon-btn"
                onClick={handleClearHistory}
                title="Limpar histórico de mensagens"
                aria-label="Limpar conversa"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
              <button
                type="button"
                className="cb-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Fechar janela de chat"
                aria-label="Fechar janela"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </header>

          {/* Mensagens */}
          <div className="cb-messages-container" tabIndex={0} aria-label="Histórico de mensagens">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isError = msg.isError;

              return (
                <div
                  key={msg.id}
                  className={`cb-message-row ${isUser ? 'cb-message-row-user' : 'cb-message-row-bot'}`}
                >
                  {isUser ? (
                    <div className="cb-bubble cb-bubble-user">
                      <span>{msg.text}</span>
                      <span className="cb-timestamp">{formatTime(msg.timestamp)}</span>
                    </div>
                  ) : (
                    <div className="cb-bot-msg-group">
                      <img
                        src={VERITY_AVATAR}
                        alt="Verity IA"
                        className="cb-msg-avatar"
                        aria-hidden="true"
                      />
                      <div
                        className={`cb-bubble ${
                          isError ? 'cb-bubble-error' : 'cb-bubble-bot'
                        }`}
                      >
                        {/* Renderização segura como nó de texto (sem innerHTML para prevenir XSS) */}
                        <span>{msg.text}</span>
                        <span className="cb-timestamp">{formatTime(msg.timestamp)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Sugestões rápidas de início */}
            {messages.length === 1 && (
              <div className="cb-quick-chips">
                {QUICK_SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    className="cb-chip-btn"
                    onClick={() => void handleSendMessage(sug)}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {/* Indicador de Digitando */}
            {status === 'typing' && (
              <div className="cb-message-row cb-message-row-bot">
                <div className="cb-bot-msg-group">
                  <img
                    src={VERITY_AVATAR}
                    alt="Verity IA digitando"
                    className="cb-msg-avatar"
                    aria-hidden="true"
                  />
                  <div className="cb-typing-bubble" aria-label="Verity IA digitando resposta">
                    <span className="cb-typing-dot" />
                    <span className="cb-typing-dot" />
                    <span className="cb-typing-dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Rodapé e Campo de Envio */}
          <footer className="cb-footer">
            <form className="cb-form" onSubmit={handleFormSubmit}>
              <input
                ref={inputRef}
                type="text"
                className="cb-input"
                placeholder="Tire sua dúvida sobre empreendedorismo..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                maxLength={500}
                aria-label="Mensagem sobre empreendedorismo"
                disabled={status === 'typing'}
              />
              <button
                type="submit"
                className="cb-send-btn"
                disabled={!inputValue.trim() || status === 'typing'}
                aria-label="Enviar mensagem"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
            <div className="cb-disclaimer">
              Foco exclusivo em empreendedorismo e gestão de negócios.
            </div>
          </footer>
        </section>
      )}
    </>
  );
};
