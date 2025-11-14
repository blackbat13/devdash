const si = require('systeminformation');

async function updateProcesses() {
    try {
        const processes = await si.processes();
        const topProcesses = processes.list
            .sort((p1, p2) => (p2.cpuu || 0) - (p1.cpuu || 0))
            .slice(0, 5);

        const processListElement = document.getElementById('process-list');
        processListElement.innerHTML = ''; // Clear previous list
        topProcesses.forEach(proc => {
            const li = document.createElement('li');
            const procName = proc.name || `PID: ${proc.pid}`;
            const cpuUsage = (proc.cpuu || 0).toFixed(1);
            li.innerText = `${procName} - ${cpuUsage}%`;
            processListElement.appendChild(li);
        });
    } catch (e) {
        console.error("Error fetching processes:", e);
    }
}

setInterval(updateProcesses, 3000); // Update a bit less frequently
updateProcesses();