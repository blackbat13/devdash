const si = require('systeminformation');
const { ipcRenderer } = require('electron');

function formatBytes(bytes) {
    if (typeof bytes !== 'number' || bytes < 0) return '0 B/s';
    if (bytes === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

async function updateNet() {
    try {
        const currentNetStats = await si.networkStats();
        document.getElementById('net-rx').innerText = '↓ ' + formatBytes(currentNetStats[0].rx_sec);
        document.getElementById('net-tx').innerText = '↑ ' + formatBytes(currentNetStats[0].tx_sec);
    } catch (e) { console.error(e); }
}
setInterval(updateNet, 1500);
updateNet();