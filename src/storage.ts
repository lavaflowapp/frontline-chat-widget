export function getVisitorData(clientId: string): { name: string; phone: string } | null {
  try {
    const raw = localStorage.getItem(`fa_${clientId}_visitor`);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.name && data.phone) return data;
    return null;
  } catch {
    return null;
  }
}

export function setVisitorData(clientId: string, name: string, phone: string): void {
  localStorage.setItem(`fa_${clientId}_visitor`, JSON.stringify({ name, phone }));
}

export function getConversationId(clientId: string): string | null {
  return localStorage.getItem(`fa_${clientId}_conversation_id`);
}

export function setConversationId(clientId: string, id: string): void {
  localStorage.setItem(`fa_${clientId}_conversation_id`, id);
}
