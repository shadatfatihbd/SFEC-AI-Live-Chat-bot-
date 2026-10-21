export type SenderType = 'visitor' | 'ai' | 'bot' | 'agent';

export interface ChatMessage {
  messageId: string;
  conversationId: string;
  sender: SenderType;
  message: string;
  createdAt: string;
  isPending?: boolean;
  isError?: boolean;
}

export interface Conversation {
  conversationId: string;
  visitorId: string;
  visitorName?: string;
  status: 'open' | 'closed';
  createdAt: string;
  updatedAt?: string;
  titleSnippet?: string;
}

export interface HealthResponse {
  success: boolean;
  app?: string;
  status?: string;
  messengerUrl?: string;
  error?: string;
}

export interface CreateConversationResponse {
  success: boolean;
  conversation?: Conversation;
  error?: string;
}

export interface SendMessageResponse {
  success: boolean;
  message?: ChatMessage;
  error?: string;
}

export interface AiReplyResponse {
  success: boolean;
  message?: ChatMessage;
  reply?: string;
  error?: string;
}

export interface GetMessagesResponse {
  success: boolean;
  messages?: ChatMessage[];
  error?: string;
}

export interface GetConversationResponse {
  success: boolean;
  conversation?: Conversation;
  error?: string;
}

export type ThemeMode = 'light' | 'dark';
