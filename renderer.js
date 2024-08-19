document.getElementById('downloadForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const url = document.getElementById('url').value;

    // Envía la URL al proceso principal para iniciar la descarga
    window.electron.send('download', { url });

    // Opcional: Mensaje de estado para el usuario
    document.getElementById('result').innerText = 'Descargando...';
});

// Recibir notificación de éxito o error desde el proceso principal
window.electron.on('download-success', (message) => {
    document.getElementById('result').innerText = 'Descarga completada.';
});

window.electron.on('download-error', (error) => {
    document.getElementById('result').innerText = `Error: ${error}`;
});
