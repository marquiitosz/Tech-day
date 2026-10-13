export type MessageSender = 'user' | 'bot' | 'system';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: number;
  isError?: boolean;
}

export type ChatStatus = 'idle' | 'typing' | 'error';

export interface ChatbotResponse {
  reply: string;
  outOfScope?: boolean;
}
