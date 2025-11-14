const si = require('systeminformation');
const { ipcRenderer } = require('electron');

async function updateMem() {
    try {
        const mem = await si.mem();
        const memUsage = ((mem.used / mem.total) * 100).toFixed(1) + '%';
        document.getElementById('mem-usage').innerText = memUsage;
    } catch (e) { console.error(e); }
}
setInterval(updateMem, 1500);
updateMem();