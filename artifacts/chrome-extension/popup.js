const captureBtn = document.getElementById('captureBtn');
const btnText    = document.getElementById('btnText');
const btnIcon    = document.getElementById('btnIcon');
const dot        = document.getElementById('dot');
const statusText = document.getElementById('statusText');
const badge      = document.getElementById('badge');
const hint       = document.getElementById('hint');
const feedback   = document.getElementById('feedback');
const scKeys     = document.getElementById('scKeys');
const scEdit     = document.getElementById('scEdit');
const setupGuide = document.getElementById('setupGuide');
const setupBtn   = document.getElementById('setupBtn');

let isActive = false;

/* ─── UI state ─── */
function setActive(active) {
  isActive = active;
  dot.classList.toggle('on', active);
  statusText.textContent = active ? 'Active on all tabs' : 'Ready';
  statusText.classList.toggle('on', active);
  badge.textContent = active ? 'On' : 'Off';
  badge.classList.toggle('on', active);
  captureBtn.classList.toggle('cancel', active);
  btnText.textContent = active ? 'Disable Capture' : 'Enable Capture';
  btnIcon.innerHTML = active
    ? `<path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>`
    : `<path d="M1.5 4V3C1.5 2.17 2.17 1.5 3 1.5H4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
       <path d="M12 1.5H13C13.83 1.5 14.5 2.17 14.5 3V4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
       <path d="M14.5 12V13C14.5 13.83 13.83 14.5 13 14.5H12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
       <path d="M4 14.5H3C2.17 14.5 1.5 13.83 1.5 13V12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
       <circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.4"/>`;
  hint.textContent = active
    ? 'Hover any element on any tab, click to copy as PNG'
    : 'Click to enable on all tabs — hover an element, click to copy as PNG';
}

function showFeedback(msg, color = '#34d399') {
  feedback.style.color = color;
  feedback.textContent = msg;
  feedback.classList.add('show');
  setTimeout(() => feedback.classList.remove('show'), 2500);
}

/* ─── Button click: toggle global mode ─── */
captureBtn.addEventListener('click', async () => {
  captureBtn.disabled = true;

  if (isActive) {
    try {
      await chrome.runtime.sendMessage({ type: 'DEACTIVATE_GLOBAL' });
      setActive(false);
      showFeedback('Capture disabled on all tabs', '#f87171');
    } catch (e) {
      showFeedback('Error: ' + e.message, '#f87171');
    }
  } else {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('about:'))) {
      showFeedback('Navigate to a regular webpage first', '#fbbf24');
      captureBtn.disabled = false;
      return;
    }
    try {
      await chrome.runtime.sendMessage({ type: 'ACTIVATE_GLOBAL' });
      setActive(true);
      showFeedback('Active on all tabs — go capture!');
      setTimeout(() => window.close(), 900);
    } catch (e) {
      showFeedback('Error: ' + e.message, '#f87171');
    }
  }

  captureBtn.disabled = false;
});

/* ─── Load current global state ─── */
chrome.runtime.sendMessage({ type: 'GET_STATE' }, (res) => {
  if (chrome.runtime.lastError) return;
  if (res && res.active) setActive(true);
});

/* ─── Listen for background state changes ─── */
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'MODE_DEACTIVATED') setActive(false);
  if (msg.type === 'MODE_ACTIVATED')   setActive(true);
});

/* ─── Shortcut display ─── */
chrome.commands.getAll((commands) => {
  const cmd = commands.find(c => c.name === 'activate-capture');
  if (cmd && cmd.shortcut) {
    const parts = cmd.shortcut.split('+');
    scKeys.innerHTML = parts
      .map(k => `<span class="key">${k}</span>`)
      .join('<span class="sep">+</span>');
  } else {
    scKeys.innerHTML = '<span class="key" style="opacity:0.35;font-family:inherit;font-size:10.5px;">Not set</span>';
    setupGuide.classList.add('visible');
  }
});

function openShortcuts() {
  chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
}
scEdit.addEventListener('click', openShortcuts);
setupBtn && setupBtn.addEventListener('click', openShortcuts);
