const rowClick  = document.getElementById('row-click');
const rowDrag   = document.getElementById('row-drag');
const rowFull   = document.getElementById('row-full');
const btnClick  = document.getElementById('btn-click');
const btnDrag   = document.getElementById('btn-drag');
const btnFull   = document.getElementById('btn-full');
const keysClick = document.getElementById('keys-click');
const keysDrag  = document.getElementById('keys-drag');
const keysFull  = document.getElementById('keys-full');
const customizeBtn = document.getElementById('customizeBtn');

/* ── Render keyboard shortcut keys ── */
function renderKeys(container, shortcut) {
  if (!shortcut) {
    container.innerHTML = '<span class="key unset">Not set</span>';
    return;
  }
  const parts = shortcut.split('+');
  container.innerHTML = parts
    .map(k => `<span class="key">${k}</span>`)
    .join('');
}

/* ── Load all shortcuts ── */
chrome.commands.getAll((commands) => {
  const map = {};
  commands.forEach(c => { map[c.name] = c.shortcut || ''; });
  renderKeys(keysClick, map['capture-click'] || '');
  renderKeys(keysDrag,  map['capture-drag']  || '');
  renderKeys(keysFull,  map['capture-full']  || '');
});

/* ── Mark active mode ── */
function setActiveRow(mode) {
  [rowClick, rowDrag, rowFull].forEach(r => r.classList.remove('active'));
  if (mode === 'click') rowClick.classList.add('active');
  if (mode === 'drag')  rowDrag.classList.add('active');
  if (mode === 'full')  rowFull.classList.add('active');
}

/* ── Check current tab state ── */
chrome.runtime.sendMessage({ type: 'GET_STATE' }, (res) => {
  if (chrome.runtime.lastError) return;
  if (res && res.active && res.mode) setActiveRow(res.mode);
});

/* ── Listen for background mode changes ── */
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'MODE_ACTIVATED' && msg.mode) setActiveRow(msg.mode);
  if (msg.type === 'MODE_DEACTIVATED') setActiveRow(null);
});

/* ── Activate helpers ── */
async function activate(type) {
  // Check if on a valid tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('about:'))) {
    return; // Can't inject on these pages
  }

  try {
    await chrome.runtime.sendMessage({ type });
    if (type !== 'ACTIVATE_FULL') {
      // Close popup so user can interact with page
      setTimeout(() => window.close(), 150);
    } else {
      // Full screenshot: popup can close immediately
      setTimeout(() => window.close(), 80);
    }
  } catch (e) {
    // ignore
  }
}

btnClick.addEventListener('click', (e) => { e.stopPropagation(); activate('ACTIVATE_CLICK'); });
btnDrag.addEventListener('click',  (e) => { e.stopPropagation(); activate('ACTIVATE_DRAG');  });
btnFull.addEventListener('click',  (e) => { e.stopPropagation(); activate('ACTIVATE_FULL');  });

/* ── Also allow clicking the whole row ── */
rowClick.addEventListener('click', (e) => { if (!e.target.closest('.mode-btn')) activate('ACTIVATE_CLICK'); });
rowDrag.addEventListener('click',  (e) => { if (!e.target.closest('.mode-btn')) activate('ACTIVATE_DRAG');  });
rowFull.addEventListener('click',  (e) => { if (!e.target.closest('.mode-btn')) activate('ACTIVATE_FULL');  });

/* ── Customize shortcuts ── */
customizeBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
});
