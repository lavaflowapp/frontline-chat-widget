export function getConversationId(clientId: string): string | null {
  return localStorage.getItem(`fa_${clientId}_conversation_id`);
}

export function setConversationId(clientId: string, id: string): void {
  localStorage.setItem(`fa_${clientId}_conversation_id`, id);
}
