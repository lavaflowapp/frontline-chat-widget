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
  phone: string,
  name: string
): Promise<SessionResponse> {
  const res = await fetch(`${apiUrl}/api/bdc/chat/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      caller_phone: phone,
      caller_name: name,
    }),
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
  phone: string,
  message: string,
  name: string
): Promise<ChatResponse> {
  const res = await fetch(`${apiUrl}/api/bdc/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      caller_phone: phone,
      message,
      caller_name: name,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}
