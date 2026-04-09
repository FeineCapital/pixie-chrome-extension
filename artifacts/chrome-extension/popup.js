const captureBtn = document.getElementById('captureBtn');
const btnText    = document.getElementById('btnText');
const btnIcon    = document.getElementById('btnIcon');
const statusDot  = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const hint       = document.getElementById('hint');
const feedback   = document.getElementById('feedback');

let isActive = false;

function setActive(active) {
  isActive = active;

  if (active) {
    captureBtn.classList.add('scanning');
    btnText.textContent = 'Cancel Capture';
    btnIcon.innerHTML = `
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    `;
    statusDot.classList.add('active');
    statusText.classList.add('active');
    statusText.textContent = 'Scanning mode active';
    hint.textContent = 'Hover an element and click to capture it as PNG';
  } else {
    captureBtn.classList.remove('scanning');
    btnText.textContent = 'Capture Element';
    btnIcon.innerHTML = `
      <path d="M1.5 4V3C1.5 2.17 2.17 1.5 3 1.5H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M12 1.5H13C13.83 1.5 14.5 2.17 14.5 3V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M14.5 12V13C14.5 13.83 13.83 14.5 13 14.5H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M4 14.5H3C2.17 14.5 1.5 13.83 1.5 13V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.5"/>
    `;
    statusDot.classList.remove('active');
    statusText.classList.remove('active');
    statusText.textContent = 'Ready to capture';
    hint.textContent = 'Hover over any element, then click to capture it as PNG';
  }
}

function showFeedback(msg, color = '#00ff88') {
  feedback.style.color = color;
  feedback.textContent = msg;
  feedback.classList.add('show');
  setTimeout(() => feedback.classList.remove('show'), 2500);
}

captureBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.id) {
    showFeedback('No active tab found', '#ff4d6d');
    return;
  }

  // Check if we can inject into this tab
  if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('about:'))) {
    showFeedback('Cannot capture this page type', '#ff4d6d');
    return;
  }

  if (isActive) {
    // Deactivate
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'DEACTIVATE' });
    } catch (e) {}
    setActive(false);
    showFeedback('Capture mode cancelled', '#ff9f40');
  } else {
    // Activate — inject content script first, then send activate
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
    } catch (e) {
      // Already injected, ignore
    }

    try {
      const response = await chrome.tabs.sendMessage(tab.id, { type: 'ACTIVATE' });
      if (response && response.ok) {
        setActive(true);
        showFeedback('Hover an element to highlight it');
        // Close popup so the user can interact with the page
        setTimeout(() => window.close(), 800);
      }
    } catch (e) {
      showFeedback('Could not inject into tab', '#ff4d6d');
    }
  }
});

// Sync state with background on load
chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (!tab || !tab.id) return;
  chrome.runtime.sendMessage({ type: 'GET_STATE', tabId: tab.id }, (res) => {
    if (chrome.runtime.lastError) return;
    if (res && res.active) setActive(true);
  });
});

// Listen for messages from background
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'MODE_DEACTIVATED') setActive(false);
});

// Load and display the keyboard shortcut
chrome.commands.getAll((commands) => {
  const cmd = commands.find(c => c.name === 'activate-capture');
  const keysContainer = document.getElementById('shortcutKeys');
  if (cmd && cmd.shortcut) {
    // Parse shortcut into individual key badges (e.g. "Ctrl+Shift+E" → ["Ctrl","Shift","E"])
    const parts = cmd.shortcut.split('+');
    keysContainer.innerHTML = parts.map(k => `<span class="key">${k}</span>`).join('<span style="color:rgba(255,255,255,0.2);font-size:9px;margin:0 1px;">+</span>');
  } else {
    keysContainer.innerHTML = '<span class="key" style="opacity:0.4">Not set</span>';
  }
});

// Open Chrome's shortcut settings page
document.getElementById('shortcutEdit').addEventListener('click', () => {
  chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
});
