const si = require('systeminformation');
const { ipcRenderer } = require('electron');

async function updateCpu() {
    try {
        const cpu = await si.currentLoad();
        document.getElementById('cpu-usage').innerText = cpu.currentLoad.toFixed(1) + '%';
    } catch (e) { console.error(e); }
}
setInterval(updateCpu, 1500);
updateCpu();