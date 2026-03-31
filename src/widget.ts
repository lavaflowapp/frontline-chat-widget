import { STYLES } from './styles';
import { getVisitorData, setVisitorData, getConversationId, setConversationId } from './storage';
import { initSession, sendMessage, SessionMessage } from './api';

interface WidgetConfig {
  clientId: string;
  apiUrl: string;
  dealerName?: string;
}

// ── SVG Icons ──

const CHAT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>`;

const SEND_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;

const CLOSE_ICON = `&#x2715;`;

// ── State ──

type WidgetState = 'closed' | 'prechat' | 'open';

let state: WidgetState = 'closed';
let config: WidgetConfig | null = null;
let shadow: ShadowRoot | null = null;
let sending = false;

// ── DOM refs (set after render) ──

let panelEl: HTMLElement;
let messagesEl: HTMLElement;
let inputEl: HTMLInputElement;
let sendBtn: HTMLButtonElement;

// ── Init ──

export function init(cfg: WidgetConfig) {
  if (shadow) return; // already mounted
  config = cfg;

  const host = document.createElement('div');
  host.id = 'frontline-chat-widget';
  document.body.appendChild(host);
  shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = STYLES;
  shadow.appendChild(style);

  renderBubble();
  renderPanel();
}

// ── Render ──

function renderBubble() {
  const btn = document.createElement('button');
  btn.id = 'fa-bubble';
  btn.innerHTML = CHAT_ICON;
  btn.setAttribute('aria-label', 'Open chat');
  btn.addEventListener('click', togglePanel);
  shadow!.appendChild(btn);
}

function renderPanel() {
  panelEl = document.createElement('div');
  panelEl.id = 'fa-panel';

  const dealerName = config!.dealerName || 'Chat with us';

  panelEl.innerHTML = `
    <div id="fa-header">
      <div>
        <div id="fa-header-title">${escapeHtml(dealerName)}</div>
        <div id="fa-header-subtitle">Typically replies in seconds</div>
      </div>
      <button id="fa-close">${CLOSE_ICON}</button>
    </div>
    <div id="fa-prechat">
      <h3>Start a conversation</h3>
      <p>Enter your info so we can help you.</p>
      <div class="fa-field">
        <label for="fa-name-input">Name</label>
        <input id="fa-name-input" type="text" placeholder="Your name" />
      </div>
      <div class="fa-field">
        <label for="fa-phone-input">Phone</label>
        <input id="fa-phone-input" type="tel" placeholder="(555) 555-1234" />
      </div>
      <button id="fa-start">Start Chat</button>
    </div>
    <div id="fa-messages"></div>
    <div id="fa-input-area">
      <input id="fa-input" type="text" placeholder="Type a message..." />
      <button id="fa-send">${SEND_ICON}</button>
    </div>
  `;

  shadow!.appendChild(panelEl);

  // Cache refs
  messagesEl = shadow!.getElementById('fa-messages') as HTMLElement;
  inputEl = shadow!.getElementById('fa-input') as HTMLInputElement;
  sendBtn = shadow!.getElementById('fa-send') as HTMLButtonElement;

  // Hide chat UI initially (prechat is visible first)
  messagesEl.style.display = 'none';
  (shadow!.getElementById('fa-input-area') as HTMLElement).style.display = 'none';

  // Event listeners
  shadow!.getElementById('fa-close')!.addEventListener('click', closePanel);
  shadow!.getElementById('fa-start')!.addEventListener('click', handlePrechatSubmit);
  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });
}

// ── Panel State ──

function togglePanel() {
  if (state === 'closed') {
    openPanel();
  } else {
    closePanel();
  }
}

function openPanel() {
  const visitor = getVisitorData(config!.clientId);
  if (visitor) {
    showChatUI();
    loadSession(visitor.name, visitor.phone);
  } else {
    showPrechatUI();
  }
  panelEl.classList.add('open');
}

function closePanel() {
  panelEl.classList.remove('open');
  state = 'closed';
}

function showPrechatUI() {
  state = 'prechat';
  (shadow!.getElementById('fa-prechat') as HTMLElement).style.display = 'flex';
  messagesEl.style.display = 'none';
  (shadow!.getElementById('fa-input-area') as HTMLElement).style.display = 'none';
}

function showChatUI() {
  state = 'open';
  (shadow!.getElementById('fa-prechat') as HTMLElement).style.display = 'none';
  messagesEl.style.display = 'flex';
  (shadow!.getElementById('fa-input-area') as HTMLElement).style.display = 'flex';
  inputEl.focus();
}

// ── Pre-chat ──

function handlePrechatSubmit() {
  const nameInput = shadow!.getElementById('fa-name-input') as HTMLInputElement;
  const phoneInput = shadow!.getElementById('fa-phone-input') as HTMLInputElement;
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!name || !phone) return;

  setVisitorData(config!.clientId, name, phone);
  showChatUI();
  loadSession(name, phone);
}

// ── Session ──

async function loadSession(name: string, phone: string) {
  messagesEl.innerHTML = '';
  showTyping();

  try {
    const session = await initSession(config!.apiUrl, config!.clientId, phone, name);
    setConversationId(config!.clientId, session.conversation_id);
    hideTyping();

    if (session.messages.length === 0) {
      appendAgentMessage('Hi! How can I help you today?');
    } else {
      session.messages.forEach((msg: SessionMessage) => {
        if (msg.direction === 'inbound') {
          appendUserMessage(msg.body);
        } else {
          appendAgentMessage(msg.body);
        }
      });
    }
  } catch {
    hideTyping();
    appendAgentMessage('Hi! How can I help you today?');
  }

  scrollToBottom();
}

// ── Send Message ──

async function handleSend() {
  if (sending) return;
  const text = inputEl.value.trim();
  if (!text) return;

  const visitor = getVisitorData(config!.clientId);
  if (!visitor) return;

  inputEl.value = '';
  appendUserMessage(text);
  scrollToBottom();

  sending = true;
  sendBtn.disabled = true;
  showTyping();

  try {
    const res = await sendMessage(config!.apiUrl, config!.clientId, visitor.phone, text, visitor.name);
    setConversationId(config!.clientId, res.conversation_id);
    hideTyping();
    appendAgentMessage(res.reply);
  } catch {
    hideTyping();
    appendAgentMessage("Sorry, I'm having trouble connecting. Please try again.");
  }

  sending = false;
  sendBtn.disabled = false;
  scrollToBottom();
  inputEl.focus();
}

// ── Message Rendering ──

function appendUserMessage(text: string) {
  const el = document.createElement('div');
  el.className = 'fa-msg user';
  el.textContent = text;
  messagesEl.appendChild(el);
}

function appendAgentMessage(text: string) {
  const el = document.createElement('div');
  el.className = 'fa-msg agent';
  el.textContent = text;
  messagesEl.appendChild(el);
}

function showTyping() {
  let indicator = shadow!.querySelector('.fa-typing');
  if (indicator) return;
  const el = document.createElement('div');
  el.className = 'fa-typing';
  el.innerHTML = '<span></span><span></span><span></span>';
  messagesEl.appendChild(el);
  scrollToBottom();
}

function hideTyping() {
  const el = shadow!.querySelector('.fa-typing');
  if (el) el.remove();
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// ── Utilities ──

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Auto-init from script tag attributes ──

// Capture synchronously at parse time — document.currentScript is null inside async callbacks
const currentScript = document.currentScript;

function autoInit() {
  const script =
    currentScript ||
    document.querySelector('script[data-client-id]');

  if (!script) {
    console.warn('[FrontlineWidget] No script tag found with data-client-id');
    return;
  }

  const clientId = script.getAttribute('data-client-id');
  const apiUrl = script.getAttribute('data-api-url');

  if (!clientId || !apiUrl) {
    console.warn('[FrontlineWidget] Missing required attributes: data-client-id and data-api-url');
    return;
  }

  const dealerName = script.getAttribute('data-dealer-name') || undefined;

  init({ clientId, apiUrl, dealerName });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInit);
} else {
  autoInit();
}
