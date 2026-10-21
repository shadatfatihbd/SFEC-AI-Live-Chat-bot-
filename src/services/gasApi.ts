import {
  AiReplyResponse,
  ChatMessage,
  Conversation,
  CreateConversationResponse,
  GetConversationResponse,
  GetMessagesResponse,
  HealthResponse,
  SendMessageResponse,
} from '../types';

export const DEFAULT_GAS_ENDPOINT =
  import.meta.env.VITE_GAS_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbzpku5s-873D9Mblresqd15o0Cjhr1oJM5609UdEZfUMahg41Vwknl7xojAR7S1kiommA/exec';

export const FACEBOOK_PAGE_URL =
  import.meta.env.VITE_FACEBOOK_PAGE_URL || 'https://facebook.com/ShadatFatih.Page';

export const MESSENGER_URL =
  import.meta.env.VITE_MESSENGER_URL || 'https://m.me/ShadatFatih.Page';

const VISITOR_ID_KEY = 'sfec_visitor_id';
const ACTIVE_CONVERSATION_KEY = 'sfec_active_conversation_id';
const RECENT_CONVERSATIONS_KEY = 'sfec_recent_conversations';

/**
 * Generates or retrieves a persistent visitor ID from localStorage.
 */
export function getOrCreateVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_ID_KEY);
    if (existing && existing.trim().length > 0) {
      return existing;
    }
    const newId = `vis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(VISITOR_ID_KEY, newId);
    return newId;
  } catch {
    return `vis_${Date.now()}_temp`;
  }
}

/**
 * Retrieves the currently active conversation ID from localStorage.
 */
export function getActiveConversationId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_CONVERSATION_KEY);
  } catch {
    return null;
  }
}

/**
 * Stores the active conversation ID in localStorage.
 */
export function setActiveConversationId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(ACTIVE_CONVERSATION_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_CONVERSATION_KEY);
    }
  } catch {
    // Ignore storage errors in private browsing
  }
}

export interface StoredConversationMeta {
  conversationId: string;
  titleSnippet: string;
  createdAt: string;
  lastMessageAt?: string;
}

/**
 * Gets cached metadata for recent conversations.
 */
export function getRecentConversations(): StoredConversationMeta[] {
  try {
    const raw = localStorage.getItem(RECENT_CONVERSATIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Adds or updates a conversation in the recent list.
 */
export function recordConversation(meta: StoredConversationMeta): void {
  try {
    const current = getRecentConversations();
    const filtered = current.filter((c) => c.conversationId !== meta.conversationId);
    const updated = [meta, ...filtered].slice(0, 15);
    localStorage.setItem(RECENT_CONVERSATIONS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore
  }
}

/**
 * Performs a POST request to Google Apps Script using text/plain to avoid CORS preflight.
 */
async function postToGas<T>(payload: Record<string, unknown>): Promise<T> {
  const url = DEFAULT_GAS_ENDPOINT;
  const bodyString = JSON.stringify(payload);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyString,
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }

  const rawText = await response.text();
  try {
    return JSON.parse(rawText) as T;
  } catch {
    throw new Error(`Invalid JSON received from backend: ${rawText.slice(0, 150)}`);
  }
}

/**
 * Performs a GET request to Google Apps Script.
 */
async function getFromGas<T>(queryParams: Record<string, string>): Promise<T> {
  const url = new URL(DEFAULT_GAS_ENDPOINT);
  Object.entries(queryParams).forEach(([k, v]) => {
    url.searchParams.set(k, v);
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }

  const rawText = await response.text();
  try {
    return JSON.parse(rawText) as T;
  } catch {
    throw new Error(`Invalid JSON received from backend: ${rawText.slice(0, 150)}`);
  }
}

/**
 * Checks backend health status.
 */
export async function checkBackendHealth(): Promise<HealthResponse> {
  try {
    return await getFromGas<HealthResponse>({ action: 'health' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown network error';
    return {
      success: false,
      status: 'offline',
      error: msg,
    };
  }
}

/**
 * Creates a new conversation in Google Apps Script / Google Sheets.
 */
export async function createConversation(
  visitorId: string,
  visitorName?: string
): Promise<CreateConversationResponse> {
  return await postToGas<CreateConversationResponse>({
    action: 'createConversation',
    visitorId,
    visitorName: visitorName || 'Student',
  });
}

/**
 * Sends a visitor message to an existing conversation.
 */
export async function sendMessage(
  conversationId: string,
  visitorId: string,
  message: string
): Promise<SendMessageResponse> {
  return await postToGas<SendMessageResponse>({
    action: 'sendMessage',
    conversationId,
    visitorId,
    message: message.trim(),
  });
}

/**
 * Requests an AI reply from Gemini through the Google Apps Script backend.
 */
export async function requestAiReply(
  conversationId: string,
  visitorId: string,
  message?: string
): Promise<AiReplyResponse> {
  return await postToGas<AiReplyResponse>({
    action: 'aiReply',
    conversationId,
    visitorId,
    ...(message ? { message: message.trim() } : {}),
  });
}

/**
 * Retrieves all messages for a specific conversation.
 */
export async function getConversationMessages(
  conversationId: string
): Promise<GetMessagesResponse> {
  return await getFromGas<GetMessagesResponse>({
    action: 'messages',
    conversationId,
  });
}

/**
 * Retrieves details for a specific conversation.
 */
export async function getConversationDetails(
  conversationId: string
): Promise<GetConversationResponse> {
  return await getFromGas<GetConversationResponse>({
    action: 'conversation',
    conversationId,
  });
}
