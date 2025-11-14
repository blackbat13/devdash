// main.js - The New Widget Manager
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Store references to our widget windows
let windows = {
    cpu: null,
    memory: null,
    network: null,
    processes: null
};

// Function to create a single widget window
function createWidget(name, htmlFile, width, height) {
    const win = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        },
        frame: false, // Removes the default frame, title bar, etc.
        alwaysOnTop: true, // Keeps widgets on top of other windows
        resizable: false,
        skipTaskbar: true, // Don't show in the taskbar/dock
        transparent: true, // Enable window transparency
        backgroundColor: '#00000000' // Set a fully transparent background
    });
    win.loadFile(htmlFile);
    return win;
}

// Function to create all widgets
function createWidgets() {
    windows.cpu = createWidget('cpu', path.join(__dirname, '..', 'widgets', 'widget-cpu.html'), 180, 100);
    windows.memory = createWidget('memory', path.join(__dirname, '..', 'widgets', 'widget-memory.html'), 180, 100);
    windows.network = createWidget('network', path.join(__dirname, '..', 'widgets', 'widget-network.html'), 220, 120);
    windows.processes = createWidget('processes', path.join(__dirname, '..', 'widgets', 'widget-processes.html'), 250, 200); // <-- ADD THIS LINE
    
    // Position widgets
    windows.cpu.setPosition(100, 100);
    windows.memory.setPosition(100, 220);
    windows.network.setPosition(300, 100);
    windows.processes.setPosition(300, 240); // <-- ADD THIS LINE
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWidgets);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Listen for a 'quit' message from any of the widgets
ipcMain.on('quit-app', () => {
    app.quit();
});