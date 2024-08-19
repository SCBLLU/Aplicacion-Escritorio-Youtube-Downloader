const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.on('download', (event, { url }) => {
        const outputPath = 'C:\\Users\\scbll\\Downloads\\Musica';
        const command = `yt-dlp --extract-audio --audio-format mp3 --output "${outputPath}/%(title)s.%(ext)s" ${url}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                event.reply('download-error', error.message);
                return;
            }
            event.reply('download-success', stdout);
        });
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
