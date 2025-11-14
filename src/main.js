// src/main.js - The New Widget Manager with Tray
const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
const path = require('path');

// Store references to our widget windows and the tray
let windows = {
    cpu: null,
    memory: null,
    network: null,
    processes: null
};
let tray = null;

// --- Window Creation Functions ---

function createWidget(name, htmlFile, width, height) {
    return new BrowserWindow({
        width: width,
        height: height,
        show: false, // Start hidden
        webPreferences: { contextIsolation: false, nodeIntegration: true },
        frame: false,
        alwaysOnTop: true,
        resizable: false,
        skipTaskbar: true,
        transparent: true,
        backgroundColor: '#00000000'
    });
}

function createAllWidgets() {
    windows.cpu = createWidget('cpu', path.join(__dirname, '..', 'widgets', 'widget-cpu.html'), 180, 100);
    windows.memory = createWidget('memory', path.join(__dirname, '..', 'widgets', 'widget-memory.html'), 180, 100);
    windows.network = createWidget('network', path.join(__dirname, '..', 'widgets', 'widget-network.html'), 220, 120);
    windows.processes = createWidget('processes', path.join(__dirname, '..', 'widgets', 'widget-processes.html'), 250, 200);

    // Load content and set initial positions
    windows.cpu.loadFile(path.join(__dirname, '..', 'widgets', 'widget-cpu.html')).then(() => windows.cpu.setPosition(100, 100));
    windows.memory.loadFile(path.join(__dirname, '..', 'widgets', 'widget-memory.html')).then(() => windows.memory.setPosition(100, 220));
    windows.network.loadFile(path.join(__dirname, '..', 'widgets', 'widget-network.html')).then(() => windows.network.setPosition(300, 100));
    windows.processes.loadFile(path.join(__dirname, '..', 'widgets', 'widget-processes.html')).then(() => windows.processes.setPosition(300, 240));
}

// --- Tray and Menu Functions ---

function createTray() {
    tray = new Tray(path.join(__dirname, '..', 'assets', 'icon.png'));
    tray.setToolTip('DevDash Widgets');
    updateTrayMenu();
}

function updateTrayMenu() {
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show CPU Widget', type: 'checkbox', checked: windows.cpu.isVisible(), click: () => toggleWidget('cpu') },
        { label: 'Show Memory Widget', type: 'checkbox', checked: windows.memory.isVisible(), click: () => toggleWidget('memory') },
        { label: 'Show Network Widget', type: 'checkbox', checked: windows.network.isVisible(), click: () => toggleWidget('network') },
        { label: 'Show Processes Widget', type: 'checkbox', checked: windows.processes.isVisible(), click: () => toggleWidget('processes') },
        { type: 'separator' },
        { label: 'Quit DevDash', role: 'quit' }
    ]);
    tray.setContextMenu(contextMenu);
}

function toggleWidget(name) {
    const win = windows[name];
    if (win.isVisible()) {
        win.hide();
    } else {
        win.show();
    }
    // Update the menu to reflect the new state
    updateTrayMenu();
}


// --- App Lifecycle ---

app.whenReady().then(() => {
    createAllWidgets();
    createTray();
    // Show all widgets by default on start
    Object.values(windows).forEach(win => win.show());
});

app.on('window-all-closed', () => {
    // On macOS, you want the app and its menu bar to stay active
    // until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        // Don't quit on window-all-closed, let the tray manage the app life
    }
});

app.on('activate', () => {
    // On macOS, re-create a window if none are open
    if (BrowserWindow.getAllWindows().length === 0) {
        Object.values(windows).forEach(win => win.show());
    }
});

// Listen for a 'quit' message from any of the widgets
ipcMain.on('quit-app', () => {
    app.quit();
});