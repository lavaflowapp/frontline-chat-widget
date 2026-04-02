export interface SessionMessage {
  sender: string;
  body: string;
  direction: 'inbound' | 'outbound';
  created_at: string;
}

export interface SessionResponse {
  conversation_id: string;
  messages: SessionMessage[];
}

export interface ChatResponse {
  reply: string;
  conversation_id: string;
}

export async function initSession(
  apiUrl: string,
  clientId: string,
  phone = '',
  name = ''
): Promise<SessionResponse> {
  const payload: Record<string, string> = { client_id: clientId };
  if (phone) payload.caller_phone = phone;
  if (name) payload.caller_name = name;

  const res = await fetch(`${apiUrl}/api/bdc/chat/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function sendMessage(
  apiUrl: string,
  clientId: string,
  message: string,
  conversationId = '',
  phone = '',
  name = ''
): Promise<ChatResponse> {
  const payload: Record<string, string> = { client_id: clientId, message };
  if (conversationId) payload.conversation_id = conversationId;
  if (phone) payload.caller_phone = phone;
  if (name) payload.caller_name = name;

  const res = await fetch(`${apiUrl}/api/bdc/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}
