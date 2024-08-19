const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.on('download', (event, { url, outputPath }) => {
        // Envolver la URL en comillas dobles
        const safeUrl = `"${url}"`;
        const command = `yt-dlp --extract-audio --audio-format mp3 --output "${path.join(outputPath, '%(title)s.%(ext)s')}" ${safeUrl}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                event.reply('download-error', error.message);
                return;
            }
            if (stderr) {
                event.reply('download-error', stderr);
                return;
            }

            // Listar archivos descargados
            let files = [];
            try {
                files = fs.readdirSync(outputPath);
            } catch (e) {
                event.reply('download-error', 'Error al leer el directorio de salida.');
                return;
            }

            event.reply('download-success', { message: 'Descarga completada.', files });
        });
    });

    ipcMain.on('select-path', (event) => {
        const { dialog } = require('electron');
        try {
            dialog.showOpenDialog({
                properties: ['openDirectory']
            }).then(result => {
                if (!result.canceled && result.filePaths.length > 0) {
                    const selectedPath = result.filePaths[0];
                    event.reply('path-selected', selectedPath);
                }
            }).catch(err => {
                event.reply('download-error', 'Error al seleccionar la ruta.');
            });
        } catch (error) {
            event.reply('download-error', 'Error inesperado al seleccionar la ruta.');
        }
    });

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
