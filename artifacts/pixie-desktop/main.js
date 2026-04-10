const {
  app, BrowserWindow, globalShortcut, desktopCapturer,
  clipboard, nativeImage, ipcMain, screen, Tray, Menu,
  dialog, systemPreferences, Notification
} = require('electron');
const path = require('path');
const fs   = require('fs');
const os   = require('os');

let overlayWin  = null;
let tray        = null;
let capturing   = false;

// ─── Permission check ───────────────────────────────────────────────────────

async function ensureScreenPermission() {
  const status = systemPreferences.getMediaAccessStatus('screen');
  if (status === 'granted') return true;

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Screen Recording Permission Required',
    message: 'Pixie needs Screen Recording permission to capture your screen.',
    detail: 'Go to:\nSystem Settings → Privacy & Security → Screen Recording\n\nEnable the toggle next to Pixie, then relaunch the app.',
    buttons: ['Open System Settings', 'Later'],
    defaultId: 0,
  });

  if (response === 0) {
    const { shell } = require('electron');
    shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture');
  }
  return false;
}

// ─── Overlay window ──────────────────────────────────────────────────────────

function createOverlay() {
  const primary = screen.getPrimaryDisplay();
  const { bounds, scaleFactor } = primary;

  overlayWin = new BrowserWindow({
    x:      bounds.x,
    y:      bounds.y,
    width:  bounds.width,
    height: bounds.height,
    transparent:   true,
    frame:         false,
    // Use 'floating' NOT 'screen-saver' — screen-saver level covers the menu bar
    // and locks the user out of the OS. 'floating' stays above apps but not system UI.
    alwaysOnTop:   true,
    focusable:     false,
    skipTaskbar:   true,
    hasShadow:     false,
    resizable:     false,
    movable:       false,
    webPreferences: {
      preload:          path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration:  false,
    },
  });

  overlayWin.setIgnoreMouseEvents(true);
  overlayWin.setAlwaysOnTop(true, 'floating');
  overlayWin.setVisibleOnAllWorkspaces(true);
  overlayWin.loadFile('index.html');

  overlayWin.webContents.once('did-finish-load', () => {
    overlayWin.webContents.send('init', { scaleFactor });
  });
}

// ─── Tray ────────────────────────────────────────────────────────────────────

function createTray() {
  // Use empty image + text title — reliable cross-macOS approach for menu bar text
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  tray.setTitle('Pixie');
  tray.setToolTip('Pixie — ⌘⇧7 click & capture  •  ⌘⇧8 full screen');

  updateTrayMenu();
}

function updateTrayMenu() {
  const menu = Menu.buildFromTemplate([
    { label: 'Pixie', enabled: false },
    { type: 'separator' },
    { label: 'Click & Capture    ⌘⇧7', click: () => activateCapture() },
    { label: 'Full Screen         ⌘⇧8', click: () => captureFullScreen() },
    { type: 'separator' },
    { label: 'How to use:', enabled: false },
    { label: '  1. Press ⌘⇧7 to start click & capture', enabled: false },
    { label: '  2. Drag to select any region', enabled: false },
    { label: '  3. Press ⌘C to copy, Enter to save', enabled: false },
    { label: '  4. Press Esc to cancel', enabled: false },
    { type: 'separator' },
    { label: 'Quit Pixie', click: () => app.quit() },
  ]);
  tray.setContextMenu(menu);
}

// ─── Capture ─────────────────────────────────────────────────────────────────

async function activateCapture() {
  if (capturing) return;

  const ok = await ensureScreenPermission();
  if (!ok) return;

  capturing = true;
  if (!overlayWin) return;

  overlayWin.setFocusable(true);
  overlayWin.setIgnoreMouseEvents(false);
  overlayWin.focus();
  overlayWin.webContents.send('activate');
}

function deactivateCapture() {
  capturing = false;
  if (!overlayWin) return;
  overlayWin.setIgnoreMouseEvents(true);
  overlayWin.setFocusable(false);
  overlayWin.webContents.send('deactivate');
}

// ─── IPC ─────────────────────────────────────────────────────────────────────

ipcMain.handle('take-screenshot', async () => {
  const primary = screen.getPrimaryDisplay();
  const { bounds, scaleFactor } = primary;

  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: {
      width:  Math.round(bounds.width  * scaleFactor),
      height: Math.round(bounds.height * scaleFactor),
    },
  });

  if (!sources.length) return null;
  return sources[0].thumbnail.toPNG().toString('base64');
});

ipcMain.handle('copy-to-clipboard', async (_e, base64) => {
  const img = nativeImage.createFromBuffer(Buffer.from(base64, 'base64'));
  clipboard.writeImage(img);
  return true;
});

ipcMain.handle('save-to-desktop', async (_e, base64) => {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filePath = path.join(os.homedir(), 'Desktop', `pixie-${ts}.png`);
  fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
  return filePath;
});

ipcMain.on('deactivate', () => deactivateCapture());

// ─── Full screen capture ─────────────────────────────────────────────────────

async function captureFullScreen() {
  const ok = await ensureScreenPermission();
  if (!ok) return;

  const primary = screen.getPrimaryDisplay();
  const { bounds, scaleFactor } = primary;

  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: {
      width:  Math.round(bounds.width  * scaleFactor),
      height: Math.round(bounds.height * scaleFactor),
    },
  });

  if (!sources.length) return;

  const pngBuf = sources[0].thumbnail.toPNG();
  clipboard.writeImage(nativeImage.createFromBuffer(pngBuf));

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filePath = path.join(os.homedir(), 'Desktop', `pixie-${ts}.png`);
  fs.writeFileSync(filePath, pngBuf);

  if (overlayWin) overlayWin.webContents.send('toast', 'Full screen captured + saved ✓');
}

// ─── First launch notification ────────────────────────────────────────────────

function showWelcomeNotification() {
  const flagPath = path.join(os.homedir(), '.pixie-launched');
  if (fs.existsSync(flagPath)) return;
  fs.writeFileSync(flagPath, '1');

  if (Notification.isSupported()) {
    new Notification({
      title: 'Pixie is running',
      body: '⌘⇧7 = click & capture  •  ⌘⇧8 = full screen\nClick the Pixie icon in your menu bar anytime.',
    }).show();
  }
}

// ─── App lifecycle ────────────────────────────────────────────────────────────

app.dock.hide();

app.whenReady().then(() => {
  createOverlay();
  createTray();

  // Global Escape always cancels a capture — safety valve so user is never locked out
  globalShortcut.register('Escape', () => {
    if (capturing) deactivateCapture();
  });

  globalShortcut.register('CommandOrControl+Shift+7', () => activateCapture());
  globalShortcut.register('CommandOrControl+Shift+8', () => captureFullScreen());

  showWelcomeNotification();
});

app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', (e) => e.preventDefault());
