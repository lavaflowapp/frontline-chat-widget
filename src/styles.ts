export const STYLES = `
  :host {
    all: initial;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.4;
    color: #1a1a1a;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* ── Bubble ── */
  #fa-bubble {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #E8580A;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    z-index: 2147483647;
  }

  #fa-bubble:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  #fa-bubble svg {
    width: 24px;
    height: 24px;
    fill: #fff;
  }

  /* ── Chat Panel ── */
  #fa-panel {
    position: fixed;
    bottom: 96px;
    right: 24px;
    width: 370px;
    max-height: 520px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
    display: none;
    flex-direction: column;
    overflow: hidden;
    z-index: 2147483646;
    animation: fa-slide-up 0.25s ease-out;
  }

  #fa-panel.open {
    display: flex;
  }

  @keyframes fa-slide-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Header ── */
  #fa-header {
    background: #E8580A;
    color: #fff;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  #fa-header-title {
    font-size: 15px;
    font-weight: 600;
  }

  #fa-header-subtitle {
    font-size: 12px;
    opacity: 0.85;
    margin-top: 2px;
  }

  #fa-close {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 4px;
    font-size: 18px;
    line-height: 1;
    opacity: 0.8;
    transition: opacity 0.15s;
  }

  #fa-close:hover {
    opacity: 1;
  }

  /* ── Messages ── */
  #fa-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 200px;
    max-height: 340px;
  }

  .fa-msg {
    max-width: 80%;
    padding: 10px 14px;
    border-radius: 16px;
    font-size: 13px;
    line-height: 1.45;
    word-wrap: break-word;
  }

  .fa-msg.agent {
    align-self: flex-start;
    background: #f0f0f0;
    color: #1a1a1a;
    border-bottom-left-radius: 4px;
  }

  .fa-msg.user {
    align-self: flex-end;
    background: #E8580A;
    color: #fff;
    border-bottom-right-radius: 4px;
  }

  /* ── Typing Indicator ── */
  .fa-typing {
    align-self: flex-start;
    display: flex;
    gap: 4px;
    padding: 12px 16px;
    background: #f0f0f0;
    border-radius: 16px;
    border-bottom-left-radius: 4px;
  }

  .fa-typing span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #999;
    animation: fa-bounce 1.4s infinite ease-in-out both;
  }

  .fa-typing span:nth-child(1) { animation-delay: -0.32s; }
  .fa-typing span:nth-child(2) { animation-delay: -0.16s; }
  .fa-typing span:nth-child(3) { animation-delay: 0s; }

  @keyframes fa-bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }

  /* ── Input ── */
  #fa-input-area {
    display: flex;
    align-items: center;
    padding: 12px;
    border-top: 1px solid #e5e5e5;
    gap: 8px;
    flex-shrink: 0;
  }

  #fa-input {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 24px;
    padding: 10px 16px;
    font-size: 13px;
    outline: none;
    transition: border-color 0.15s;
    font-family: inherit;
  }

  #fa-input:focus {
    border-color: #E8580A;
  }

  #fa-send {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #E8580A;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.15s;
  }

  #fa-send:hover {
    background: #d04e08;
  }

  #fa-send:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  #fa-send svg {
    width: 16px;
    height: 16px;
    fill: #fff;
  }

  /* ── Pre-chat Form ── */
  #fa-prechat {
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  #fa-prechat h3 {
    font-size: 15px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 4px;
  }

  #fa-prechat p {
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
  }

  .fa-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .fa-field label {
    font-size: 12px;
    font-weight: 500;
    color: #555;
  }

  .fa-field input {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 13px;
    outline: none;
    transition: border-color 0.15s;
    font-family: inherit;
  }

  .fa-field input:focus {
    border-color: #E8580A;
  }

  #fa-start {
    background: #E8580A;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
    margin-top: 4px;
    font-family: inherit;
  }

  #fa-start:hover {
    background: #d04e08;
  }

  #fa-start:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  /* ── Empty state ── */
  .fa-empty {
    text-align: center;
    color: #999;
    font-size: 13px;
    padding: 32px 16px;
  }

  /* ── Mobile ── */
  @media (max-width: 480px) {
    #fa-panel {
      width: calc(100vw - 16px);
      right: 8px;
      bottom: 88px;
      max-height: calc(100vh - 120px);
      border-radius: 12px;
    }
  }
`;
