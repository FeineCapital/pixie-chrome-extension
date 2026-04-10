const {
  app, BrowserWindow, globalShortcut, desktopCapturer,
  clipboard, nativeImage, ipcMain, screen, Tray, Menu,
  dialog, systemPreferences, Notification
} = require('electron');
const { autoUpdater } = require('electron-updater');
const { execSync } = require('child_process');
const path = require('path');
const fs   = require('fs');
const os   = require('os');

let overlayWin   = null;
let onboardingWin = null;
let tray          = null;
let capturing     = false;

// ─── Auto updater ─────────────────────────────────────────────────────────────

function setupAutoUpdater() {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('update-available', (info) => {
    if (overlayWin) overlayWin.webContents.send('toast', `Update v${info.version} downloading...`);
  });
  autoUpdater.on('update-downloaded', () => {
    if (overlayWin) overlayWin.webContents.send('toast', 'Update ready — installs on next quit ✓');
    updateTrayMenu(true);
  });
  autoUpdater.on('error', () => {});
  autoUpdater.checkForUpdates().catch(() => {});
}

// ─── Permission check ─────────────────────────────────────────────────────────

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

// ─── Window detection (for click & capture) ───────────────────────────────────

function getWindowBounds() {
  try {
    const code = [
      'ObjC.import("CoreGraphics");',
      'var wins = ObjC.deepUnwrap($.CGWindowListCopyWindowInfo(',
      '  $.kCGWindowListOptionOnScreenOnly | $.kCGWindowListExcludeDesktopElements,',
      '  $.kCGNullWindowID));',
      'JSON.stringify(wins.filter(function(w) {',
      '  return w.kCGWindowLayer === 0 && w.kCGWindowBounds.Width > 40 && w.kCGWindowBounds.Height > 40',
      '    && w.kCGWindowOwnerName !== "Pixie";',
      '}).map(function(w) {',
      '  return { owner: w.kCGWindowOwnerName, name: w.kCGWindowName || "",',
      '    x: w.kCGWindowBounds.X, y: w.kCGWindowBounds.Y,',
      '    w: w.kCGWindowBounds.Width, h: w.kCGWindowBounds.Height };',
      '}))'
    ].join('\n');
    const tmpFile = path.join(os.tmpdir(), 'pixie-windows.js');
    fs.writeFileSync(tmpFile, code);
    const result = execSync(`osascript -l JavaScript "${tmpFile}"`, { encoding: 'utf8', timeout: 3000 });
    return JSON.parse(result.trim());
  } catch { return []; }
}

// ─── Overlay window ───────────────────────────────────────────────────────────

function createOverlay() {
  const primary = screen.getPrimaryDisplay();
  const { bounds, scaleFactor } = primary;

  overlayWin = new BrowserWindow({
    x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height,
    transparent: true, frame: false, alwaysOnTop: true, focusable: false,
    skipTaskbar: true, hasShadow: false, resizable: false, movable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, nodeIntegration: false,
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

// ─── Onboarding ───────────────────────────────────────────────────────────────

function showOnboarding() {
  const flagPath = path.join(os.homedir(), '.pixie-onboarded');
  if (fs.existsSync(flagPath)) return;
  fs.writeFileSync(flagPath, '1');

  onboardingWin = new BrowserWindow({
    width: 520, height: 460, center: true, resizable: false,
    maximizable: false, minimizable: false,
    titleBarStyle: 'hidden', trafficLightPosition: { x: 14, y: 14 },
    backgroundColor: '#111318',
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });

  onboardingWin.loadFile('onboarding.html');
  onboardingWin.on('closed', () => { onboardingWin = null; });
}

// ─── Tray ─────────────────────────────────────────────────────────────────────

function createTray() {
  const iconPath = path.join(__dirname, 'trayTemplate.png');
  const icon = fs.existsSync(iconPath) ? nativeImage.createFromPath(iconPath) : nativeImage.createEmpty();
  tray = new Tray(icon);
  tray.setTitle('Pixie');
  tray.setToolTip('Pixie — ⌘⇧6 click & capture  •  ⌘⇧7 drag to select  •  ⌘⇧8 full screen');
  updateTrayMenu(false);
}

function updateTrayMenu(updateReady = false) {
  const items = [
    { label: 'Pixie', enabled: false },
    { type: 'separator' },
    { label: 'Click & Capture     ⌘⇧6', click: () => activateHoverCapture() },
    { label: 'Drag to Select       ⌘⇧7', click: () => activateDragCapture() },
    { label: 'Full Screen            ⌘⇧8', click: () => captureFullScreen() },
    { type: 'separator' },
    { label: 'Esc to cancel anytime', enabled: false },
    { type: 'separator' },
  ];
  if (updateReady) {
    items.push({ label: 'Install Update & Quit', click: () => autoUpdater.quitAndInstall() });
    items.push({ type: 'separator' });
  }
  items.push({ label: 'Quit Pixie', click: () => app.quit() });
  tray.setContextMenu(Menu.buildFromTemplate(items));
}

// ─── Capture modes ────────────────────────────────────────────────────────────

async function activateHoverCapture() {
  if (capturing) return;
  const ok = await ensureScreenPermission();
  if (!ok) return;
  capturing = true;
  if (!overlayWin) return;

  const windows = getWindowBounds();
  overlayWin.setFocusable(true);
  overlayWin.setIgnoreMouseEvents(false);
  overlayWin.focus();
  overlayWin.webContents.send('activate-hover', { windows });
}

async function activateDragCapture() {
  if (capturing) return;
  const ok = await ensureScreenPermission();
  if (!ok) return;
  capturing = true;
  if (!overlayWin) return;

  overlayWin.setFocusable(true);
  overlayWin.setIgnoreMouseEvents(false);
  overlayWin.focus();
  overlayWin.webContents.send('activate-drag');
}

function deactivateCapture() {
  capturing = false;
  if (!overlayWin) return;
  overlayWin.setIgnoreMouseEvents(true);
  overlayWin.setFocusable(false);
  overlayWin.webContents.send('deactivate');
}

// ─── IPC ──────────────────────────────────────────────────────────────────────

ipcMain.handle('take-screenshot', async () => {
  const primary = screen.getPrimaryDisplay();
  const { bounds, scaleFactor } = primary;
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { width: Math.round(bounds.width * scaleFactor), height: Math.round(bounds.height * scaleFactor) },
  });
  if (!sources.length) return null;
  return sources[0].thumbnail.toPNG().toString('base64');
});

ipcMain.handle('copy-to-clipboard', async (_e, base64) => {
  clipboard.writeImage(nativeImage.createFromBuffer(Buffer.from(base64, 'base64')));
  return true;
});

ipcMain.handle('save-to-desktop', async (_e, base64) => {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filePath = path.join(os.homedir(), 'Desktop', `pixie-${ts}.png`);
  fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
  return filePath;
});

ipcMain.on('deactivate', () => deactivateCapture());

// ─── Full screen capture ──────────────────────────────────────────────────────

async function captureFullScreen() {
  const ok = await ensureScreenPermission();
  if (!ok) return;
  const primary = screen.getPrimaryDisplay();
  const { bounds, scaleFactor } = primary;
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { width: Math.round(bounds.width * scaleFactor), height: Math.round(bounds.height * scaleFactor) },
  });
  if (!sources.length) return;
  const pngBuf = sources[0].thumbnail.toPNG();
  clipboard.writeImage(nativeImage.createFromBuffer(pngBuf));
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  fs.writeFileSync(path.join(os.homedir(), 'Desktop', `pixie-${ts}.png`), pngBuf);
  if (overlayWin) overlayWin.webContents.send('toast', 'Full screen captured + saved ✓');
}

// ─── App lifecycle ────────────────────────────────────────────────────────────

app.dock.hide();

app.whenReady().then(() => {
  createOverlay();
  createTray();

  globalShortcut.register('Escape', () => { if (capturing) deactivateCapture(); });
  globalShortcut.register('CommandOrControl+Shift+6', () => activateHoverCapture());
  globalShortcut.register('CommandOrControl+Shift+7', () => activateDragCapture());
  globalShortcut.register('CommandOrControl+Shift+8', () => captureFullScreen());

  showOnboarding();
  setTimeout(() => setupAutoUpdater(), 5000);
});

app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', (e) => e.preventDefault());
