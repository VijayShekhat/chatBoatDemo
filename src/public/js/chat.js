const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

function appendMessage(text, sender) {
  const icon = sender === 'bot' ? 'bi-robot' : 'bi-person-fill';
  const div = document.createElement('div');
  div.className = `message ${sender}-message`;
  div.innerHTML = `
    <div class="message-avatar"><i class="bi ${icon}"></i></div>
    <div class="message-bubble">${escapeHtml(text)}</div>
  `;
  chatMessages.appendChild(div);
  scrollToBottom();
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'message bot-message';
  div.id = 'typingIndicator';
  div.innerHTML = `
    <div class="message-avatar"><i class="bi bi-robot"></i></div>
    <div class="message-bubble typing-indicator">
      <span></span><span></span><span></span>
    </div>
  `;
  chatMessages.appendChild(div);
  scrollToBottom();
}

function removeTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function setLoading(loading) {
  sendBtn.disabled = loading;
  messageInput.disabled = loading;
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;

  appendMessage(message, 'user');
  messageInput.value = '';
  setLoading(true);
  showTyping();

  try {
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    removeTyping();

    if (res.ok) {
      appendMessage(data.reply, 'bot');
    } else {
      const errorMsg = data.message
        ? (Array.isArray(data.message) ? data.message.join(', ') : data.message)
        : 'Something went wrong. Please try again.';
      appendMessage(errorMsg, 'bot');
    }
  } catch {
    removeTyping();
    appendMessage('Unable to reach the server. Please check your connection.', 'bot');
  } finally {
    setLoading(false);
    messageInput.focus();
  }
});
