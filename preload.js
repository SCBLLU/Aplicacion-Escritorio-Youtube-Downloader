const { contextBridge, ipcRenderer } = require('electron');

// Exponer ipcRenderer al contexto de la ventana del navegador (renderizador)
contextBridge.exposeInMainWorld('electron', {
    send: (channel, data) => {
        // Solo permite canales seguros
        let validChannels = ['download'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    on: (channel, func) => {
        let validChannels = ['download-success', 'download-error'];
        if (validChannels.includes(channel)) {
            // Deliberadamente eliminar el primer argumento (event) de ipcRenderer.on
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
});
