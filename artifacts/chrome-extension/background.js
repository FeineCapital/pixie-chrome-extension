// Global capture state — persists across tab switches
let globallyActive = false;
const injectedTabs = new Set(); // tabs that have content script running

/* ─── Helpers ─── */
function canInjectTab(url) {
  if (!url) return false;
  return !url.startsWith('chrome://') &&
         !url.startsWith('chrome-extension://') &&
         !url.startsWith('about:') &&
         !url.startsWith('edge://') &&
         !url.startsWith('devtools://');
}

async function injectAndActivate(tabId, url) {
  if (!canInjectTab(url)) return;
  try {
    await chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] });
    injectedTabs.add(tabId);
    chrome.tabs.sendMessage(tabId, { type: 'ACTIVATE' }).catch(() => {});
  } catch (e) {}
}

async function activateAllTabs() {
  globallyActive = true;
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id && tab.url) await injectAndActivate(tab.id, tab.url);
  }
}

async function deactivateAllTabs() {
  globallyActive = false;
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (!tab.id) continue;
    try { chrome.tabs.sendMessage(tab.id, { type: 'DEACTIVATE' }).catch(() => {}); } catch (e) {}
  }
  injectedTabs.clear();
}

/* ─── When a tab finishes loading while globally active, inject into it ─── */
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status === 'loading') injectedTabs.delete(tabId);
  if (info.status === 'complete' && globallyActive && tab.url) {
    setTimeout(() => injectAndActivate(tabId, tab.url), 400);
  }
});

/* ─── When user switches to a tab while globally active, make sure it's live ─── */
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!globallyActive) return;
  if (injectedTabs.has(tabId)) return; // already running
  const tab = await chrome.tabs.get(tabId).catch(() => null);
  if (tab && tab.url) await injectAndActivate(tabId, tab.url);
});

chrome.tabs.onRemoved.addListener((tabId) => injectedTabs.delete(tabId));

/* ─── Message handler ─── */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'GET_STATE') {
    sendResponse({ active: globallyActive });
    return true;
  }

  if (msg.type === 'ACTIVATE_GLOBAL') {
    activateAllTabs().then(() => sendResponse({ ok: true }));
    return true;
  }

  if (msg.type === 'DEACTIVATE_GLOBAL') {
    deactivateAllTabs().then(() => sendResponse({ ok: true }));
    return true;
  }

  // Content script telling us it's alive
  if (msg.type === 'TAB_ACTIVATED') {
    if (sender.tab) injectedTabs.add(sender.tab.id);
    sendResponse({ ok: true });
    return true;
  }

  if (msg.type === 'TAB_DEACTIVATED') {
    // Individual tab deactivated (e.g. Escape) — but global mode stays on unless user turns off
    sendResponse({ ok: true });
    return true;
  }

  if (msg.type === 'CAPTURE_ELEMENT') {
    const { rect, devicePixelRatio } = msg;
    const tabId    = sender.tab.id;
    const windowId = sender.tab.windowId;

    (async () => {
      try {
        const dataUrl = await chrome.tabs.captureVisibleTab(windowId, { format: 'png' });
        const response = await fetch(dataUrl);
        const blob     = await response.blob();
        const bitmap   = await createImageBitmap(blob);

        const dpr = devicePixelRatio || 1;
        const sx  = Math.round(rect.x      * dpr);
        const sy  = Math.round(rect.y      * dpr);
        const sw  = Math.round(rect.width  * dpr);
        const sh  = Math.round(rect.height * dpr);

        const clampedSX = Math.max(0, Math.min(sx, bitmap.width));
        const clampedSY = Math.max(0, Math.min(sy, bitmap.height));
        const offsetX   = clampedSX - sx;
        const offsetY   = clampedSY - sy;
        const clampedSW = Math.min(sw - offsetX, bitmap.width  - clampedSX);
        const clampedSH = Math.min(sh - offsetY, bitmap.height - clampedSY);

        if (clampedSW <= 0 || clampedSH <= 0) {
          chrome.tabs.sendMessage(tabId, { type: 'CAPTURE_ERROR', error: 'Element out of viewport' });
          return;
        }

        const canvas = new OffscreenCanvas(sw, sh);
        const ctx    = canvas.getContext('2d');
        ctx.drawImage(bitmap, clampedSX, clampedSY, clampedSW, clampedSH, offsetX, offsetY, clampedSW, clampedSH);

        const pngBlob = await canvas.convertToBlob({ type: 'image/png' });
        const arrayBuffer = await pngBlob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        const CHUNK = 8192;
        for (let i = 0; i < bytes.length; i += CHUNK)
          binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
        const base64 = btoa(binary);

        chrome.tabs.sendMessage(tabId, { type: 'DO_CLIPBOARD', base64 });
      } catch (err) {
        chrome.tabs.sendMessage(tabId, { type: 'CAPTURE_ERROR', error: err.message });
      }
    })();

    sendResponse({ ok: true });
    return true;
  }
});

/* ─── Keyboard shortcut: toggle global mode ─── */
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'activate-capture') return;
  if (globallyActive) {
    await deactivateAllTabs();
  } else {
    await activateAllTabs();
  }
  // Notify any open popups
  chrome.runtime.sendMessage({ type: globallyActive ? 'MODE_ACTIVATED' : 'MODE_DEACTIVATED' }).catch(() => {});
});
