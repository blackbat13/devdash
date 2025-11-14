// renderer.js

const si = require('systeminformation');
const { ipcRenderer } = require('electron');

// Store previous network stats to calculate speed
let lastNetStats = null;

// Function to format bytes into KB, MB, GB
function formatBytes(bytes) {
    // Check if the input is not a valid number or is negative
    if (typeof bytes !== 'number' || bytes < 0) {
        return '0 B/s';
    }
    if (bytes === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Function to update the stats on the page
async function updateStats() {
    try {
        // --- CPU and Memory (no changes here) ---
        const cpu = await si.currentLoad();
        document.getElementById('cpu-usage').innerText = cpu.currentLoad.toFixed(2) + '%';

        const mem = await si.mem();
        const memUsage = ((mem.used / mem.total) * 100).toFixed(2) + '%';
        document.getElementById('mem-usage').innerText = memUsage;

        // --- Network (calculate speed) ---
        const currentNetStats = await si.networkStats();
        const currentRx = currentNetStats[0].rx_sec;
        const currentTx = currentNetStats[0].tx_sec;
        
        document.getElementById('net-rx').innerText = '↓ ' + formatBytes(currentRx);
        document.getElementById('net-tx').innerText = '↑ ' + formatBytes(currentTx);

        // --- Processes (get top 5) ---
        const processes = await si.processes(); // Go back to processes()
        const topProcesses = processes.list
            // Use the 'cpuu' property for more reliable real-time usage
            .sort((p1, p2) => (p2.cpuu || 0) - (p1.cpuu || 0)) 
            .slice(0, 5); // Get top 5

        const processListElement = document.getElementById('process-list');
        processListElement.innerHTML = ''; // Clear previous list
        topProcesses.forEach(proc => {
            const li = document.createElement('li');
            // Use the process name or PID if name is not available
            const procName = proc.name || `PID: ${proc.pid}`;
            // Use the 'cpuu' property and provide a fallback
            const cpuUsage = (proc.cpuu || 0).toFixed(2);
            li.innerText = `${procName} - ${cpuUsage}%`;
            processListElement.appendChild(li);
        });

    } catch (error) {
        console.error("Error fetching system information:", error);
    }
}

// Add event listener for the quit button
document.getElementById('quit-button').addEventListener('click', () => {
    // Send a message to the main process to quit the app
    ipcRenderer.send('quit-app');
});


// Update the stats every 2 seconds
setInterval(updateStats, 2000);

// Call it once immediately
updateStats();