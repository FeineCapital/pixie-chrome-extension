const activeTabs = new Set();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'GET_STATE') {
    sendResponse({ active: activeTabs.has(msg.tabId) });
    return true;
  }

  if (msg.type === 'TAB_ACTIVATED') {
    activeTabs.add(sender.tab.id);
    sendResponse({ ok: true });
    return true;
  }

  if (msg.type === 'TAB_DEACTIVATED') {
    activeTabs.delete(sender.tab.id);
    chrome.runtime.sendMessage({ type: 'MODE_DEACTIVATED' }).catch(() => {});
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

        // Fetch as blob → ImageBitmap (service-worker safe, no URL.createObjectURL)
        const response = await fetch(dataUrl);
        const blob     = await response.blob();
        const bitmap   = await createImageBitmap(blob);

        const dpr = devicePixelRatio || 1;
        let sx = Math.round(rect.x      * dpr);
        let sy = Math.round(rect.y      * dpr);
        const sw = Math.round(rect.width  * dpr);
        const sh = Math.round(rect.height * dpr);

        // Clamp to bitmap bounds (handles partially off-screen elements)
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

        // Convert blob → base64 (service workers don't have URL.createObjectURL or FileReader)
        const arrayBuffer = await pngBlob.arrayBuffer();
        const bytes       = new Uint8Array(arrayBuffer);
        let binary = '';
        // Process in chunks to avoid stack overflow on large images
        const CHUNK = 8192;
        for (let i = 0; i < bytes.length; i += CHUNK) {
          binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
        }
        const base64 = btoa(binary);

        // Send to content script to write to clipboard (clipboard API not available in SW)
        chrome.tabs.sendMessage(tabId, { type: 'DO_CLIPBOARD', base64 });
      } catch (err) {
        chrome.tabs.sendMessage(tabId, { type: 'CAPTURE_ERROR', error: err.message });
      }
    })();

    sendResponse({ ok: true });
    return true;
  }
});

// Keyboard command → activate capture on the active tab
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'activate-capture') return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return;
  if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('about:'))) return;

  if (activeTabs.has(tab.id)) {
    // Already active → deactivate
    try { await chrome.tabs.sendMessage(tab.id, { type: 'DEACTIVATE' }); } catch (e) {}
    activeTabs.delete(tab.id);
    chrome.runtime.sendMessage({ type: 'MODE_DEACTIVATED' }).catch(() => {});
  } else {
    // Inject then activate
    try {
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
    } catch (e) {}
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'ACTIVATE' });
    } catch (e) {}
  }
});

chrome.tabs.onRemoved.addListener((tabId) => activeTabs.delete(tabId));
chrome.tabs.onUpdated.addListener((tabId, info) => { if (info.status === 'loading') activeTabs.delete(tabId); });
