/**
 * StudyBuddy Core Script
 * - Mobile Menu Hamburger & Accordion Drawer
 * - Mobile Search Modal
 * - Master Header Navigation & Active state
 * - AI Tutor Chatbot
 * - Quiz Interactions & Toast System
 */

// 1. MOBILE MENU TOGGLE & SUBMENU ACCORDION
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');

  function openMobileMenu() {
    mobileMenuDrawer.classList.remove('hidden');
    mobileOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenuDrawer.classList.add('hidden');
    mobileOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
  if (closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  // Accordion toggle cho các mục có submenu trên Mobile
  document.querySelectorAll('.mobile-accordion-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const submenu = document.getElementById(targetId);
      const icon = btn.querySelector('.accordion-chevron');

      if (submenu) {
        const isOpen = submenu.classList.contains('open');
        // Đóng các accordion khác
        document.querySelectorAll('.mobile-submenu').forEach(sm => sm.classList.remove('open'));
        document.querySelectorAll('.accordion-chevron').forEach(ic => ic.style.transform = 'rotate(0deg)');

        if (!isOpen) {
          submenu.classList.add('open');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      }
    });
  });

  // Mobile Search Dialog Toggle
  const mobileSearchBtn = document.getElementById('mobile-search-btn');
  const searchModal = document.getElementById('search-modal');
  const closeSearchModal = document.getElementById('close-search-modal');

  if (mobileSearchBtn && searchModal) {
    mobileSearchBtn.addEventListener('click', () => {
      searchModal.classList.remove('hidden');
      searchModal.classList.add('flex');
      document.getElementById('mobile-search-input')?.focus();
    });
  }

  if (closeSearchModal && searchModal) {
    closeSearchModal.addEventListener('click', () => {
      searchModal.classList.add('hidden');
      searchModal.classList.remove('flex');
    });
  }

  // Khởi tạo các bộ lọc & Timer (nếu có trên trang)
  initFilters();
  initTimer();
});

// 2. TOAST SYSTEM
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const colors = {
    success: 'border-success-emerald bg-surface-container-high text-success-emerald',
    info: 'border-electric-cyan bg-surface-container-high text-electric-cyan',
    error: 'border-danger-rose bg-surface-container-high text-danger-rose'
  };

  toast.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-2xl bg-surface-container-high/95 backdrop-blur-xl text-on-surface text-body-sm font-semibold transition-all duration-300 transform translate-x-10 opacity-0 ${colors[type] || colors.info}`;
  
  const icon = type === 'success' ? 'check_circle' : (type === 'error' ? 'error' : 'info');
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[20px]">${icon}</span>
    <span class="text-on-surface font-body-sm">${message}</span>
  `;

  container.appendChild(toast);
  
  requestAnimationFrame(() => {
    toast.classList.remove('translate-x-10', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-10');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// 3. AI TUTOR CHATBOT POPUP
const chatbotPopup = document.getElementById('chatbot-popup');
const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
const closeChatBtn = document.getElementById('close-chat-btn');
const chatbotIcon = document.getElementById('chatbot-icon');

function toggleChatbot(forceOpen = null) {
  if (!chatbotPopup) return;
  const isClosed = chatbotPopup.classList.contains('hidden');
  const shouldOpen = forceOpen !== null ? forceOpen : isClosed;

  if (shouldOpen) {
    chatbotPopup.classList.remove('hidden');
    chatbotPopup.classList.add('flex');
    if (chatbotIcon) chatbotIcon.textContent = 'chat';
    const input = document.getElementById('chat-input');
    if (input) input.focus();
  } else {
    chatbotPopup.classList.add('hidden');
    chatbotPopup.classList.remove('flex');
    if (chatbotIcon) chatbotIcon.textContent = 'smart_toy';
  }
}

if (chatbotToggleBtn) {
  chatbotToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleChatbot();
  });
}

if (closeChatBtn) {
  closeChatBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleChatbot(false);
  });
}

function appendMessage(sender, text) {
  const chatContainer = document.getElementById('chat-messages');
  if (!chatContainer) return;
  const isUser = sender === 'user';
  const msgDiv = document.createElement('div');
  
  if (isUser) {
    msgDiv.className = 'flex items-start justify-end gap-2 max-w-[88%] ml-auto';
    msgDiv.innerHTML = `
      <div class="p-3 rounded-2xl rounded-tr-sm bg-gradient-to-r from-primary-container to-secondary-container text-on-primary font-body-sm text-[13px] leading-relaxed shadow-sm text-right">
        ${escapeHtml(text)}
      </div>
      <div class="w-7 h-7 rounded-full bg-secondary-container flex-shrink-0 flex items-center justify-center text-on-secondary text-xs font-bold mt-1">MA</div>
    `;
  } else {
    msgDiv.className = 'flex items-start gap-2.5 max-w-[88%]';
    msgDiv.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-primary-container flex-shrink-0 flex items-center justify-center text-on-primary text-xs font-bold mt-1">AI</div>
      <div class="p-3 rounded-2xl rounded-tl-sm bg-surface-container-high border border-white/5 text-on-surface font-body-sm text-[13px] leading-relaxed shadow-sm">
        ${text}
      </div>
    `;
  }
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function handleUserChat(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('chat-input');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  
  appendMessage('user', val);
  input.value = '';

  setTimeout(() => {
    let reply = `Đối với thắc mắc về "<em>${escapeHtml(val)}</em>", StudyBuddy AI gợi ý bạn tham khảo phương pháp phân tích điểm rơi và tài liệu VMO trong mục Kho tài liệu.`;
    const lower = val.toLowerCase();
    if (lower.includes('vmo')) {
      reply = `Tuyển tập Đề thi VMO kèm lời giải chi tiết 4 hướng tiếp cận đã sẵn sàng trong mục <strong>Kho tài liệu</strong>!`;
    } else if (lower.includes('cauchy') || lower.includes('bđt')) {
      reply = `Bất đẳng thức Cauchy-Schwarz dạng Engel: Với $a_1, a_2 > 0$ thì $\\frac{x_1^2}{a_1} + \\frac{x_2^2}{a_2} \\ge \\frac{(x_1+x_2)^2}{a_1+a_2}$. Dấu bằng xảy ra khi $\\frac{x_1}{a_1} = \\frac{x_2}{a_2}$.`;
    } else if (lower.includes('mixtilinear')) {
      reply = `Bổ đề Mixtilinear: Tiếp điểm của đường tròn Mixtilinear với $(O)$ là tâm vị tự biến $(O)$ thành đường tròn nội tiếp $(I)$, nối đỉnh qua tâm bàng tiếp/nội tiếp.`;
    }
    appendMessage('ai', reply);
  }, 600);
}

function sendQuickPrompt(promptText) {
  toggleChatbot(true);
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = promptText;
    handleUserChat();
  }
}

function clearChatMessages() {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  container.innerHTML = `
    <div class="flex items-start gap-2.5 max-w-[88%]">
      <div class="w-7 h-7 rounded-full bg-primary-container flex-shrink-0 flex items-center justify-center text-on-primary text-xs font-bold mt-1">AI</div>
      <div class="p-3 rounded-2xl rounded-tl-sm bg-surface-container-high border border-white/5 text-on-surface font-body-sm text-[13px] leading-relaxed shadow-sm">
        Đoạn chat đã được làm mới. Chúc bạn một buổi học hiệu quả!
      </div>
    </div>
  `;
  showToast('Đã làm mới khung chat!', 'info');
}

// 4. QUIZ & TIMER
function selectOption(buttonElement, optionLetter) {
  const container = document.getElementById('options-container');
  if (!container) return;
  const options = container.querySelectorAll('.option-card');
  
  options.forEach(opt => {
    opt.classList.remove('ring-2', 'ring-primary', 'bg-primary-container/20');
    const letterBox = opt.querySelector('div:first-child');
    if (letterBox) {
      letterBox.classList.remove('bg-primary', 'text-on-primary');
      letterBox.classList.add('bg-surface-container', 'text-on-surface-variant');
    }
  });

  buttonElement.classList.add('ring-2', 'ring-primary', 'bg-primary-container/20');
  const activeLetterBox = buttonElement.querySelector('div:first-child');
  if (activeLetterBox) {
    activeLetterBox.classList.remove('bg-surface-container', 'text-on-surface-variant');
    activeLetterBox.classList.add('bg-primary', 'text-on-primary');
  }
}

function initTimer() {
  let timeLeft = 288;
  const timerDisplay = document.getElementById('quiz-timer');
  if (!timerDisplay) return;

  setInterval(() => {
    if (timeLeft <= 0) return;
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = 
      (minutes < 10 ? '0' : '') + minutes + ':' + 
      (seconds < 10 ? '0' : '') + seconds;
  }, 1000);
}

// 5. DETAIL PAGE FILTERS & TABS
function switchTab(tabKey) {
  const tabButtons = document.querySelectorAll('.subtab-btn');
  tabButtons.forEach(btn => {
    btn.classList.remove('bg-primary-container', 'text-on-primary-container', 'shadow-md');
    btn.classList.add('text-on-surface-variant');
  });

  const activeBtn = document.getElementById(`tab-btn-${tabKey}`);
  if (activeBtn) {
    activeBtn.classList.add('bg-primary-container', 'text-on-primary-container', 'shadow-md');
    activeBtn.classList.remove('text-on-surface-variant');
  }

  if (tabKey === 'tailieu') {
    document.getElementById('section-tai-lieu')?.scrollIntoView({ behavior: 'smooth' });
  } else if (tabKey === 'hoidap') {
    document.getElementById('section-hoi-dap')?.scrollIntoView({ behavior: 'smooth' });
  } else {
    document.getElementById('section-quiz')?.scrollIntoView({ behavior: 'smooth' });
  }
}

function initFilters() {
  const topicButtons = document.querySelectorAll('#topic-filters .topic-btn');
  const quizItems = document.querySelectorAll('#quiz-list-grid .quiz-item');

  topicButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      topicButtons.forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
        b.classList.add('bg-surface-container-high', 'text-on-surface');
      });
      this.classList.remove('bg-surface-container-high', 'text-on-surface');
      this.classList.add('bg-primary', 'text-on-primary', 'shadow-sm');

      const filter = this.getAttribute('data-filter');
      quizItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-topic') === filter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

function toggleUpvote(button) {
  const countEl = button.querySelector('.upvote-count');
  if (countEl) {
    let count = parseInt(countEl.textContent, 10);
    if (!button.dataset.voted) {
      button.dataset.voted = 'true';
      countEl.textContent = count + 1;
      button.classList.add('border-primary', 'text-primary');
      showToast('Cảm ơn bạn đã ủng hộ bài viết (+1) !', 'success');
    } else {
      delete button.dataset.voted;
      countEl.textContent = count - 1;
      button.classList.remove('border-primary', 'text-primary');
    }
  }
}

function submitQAQuestion() {
  const textarea = document.getElementById('qa-input-text');
  if (!textarea || !textarea.value.trim()) {
    showToast('Vui lòng nhập nội dung câu hỏi!', 'error');
    return;
  }
  textarea.value = '';
  showToast('Đã gửi câu hỏi lên cộng đồng THPT Chuyên thành công!', 'success');
}

function insertLatexTemplate() {
  const textarea = document.getElementById('qa-input-text');
  if (textarea) {
    textarea.value += ' $$\sum_{i=1}^{n} \frac{a_i}{b_i + c_i} \ge \frac{3}{2}$$ ';
    textarea.focus();
    showToast('Đã chèn mẫu LaTeX!', 'info');
  }
}

function escapeHtml(string) {
  const entityMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(string).replace(/[&<>"']/g, s => entityMap[s]);
}
