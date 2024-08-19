document.addEventListener('DOMContentLoaded', () => {
    // Ruta de descarga predeterminada
    const defaultPath = 'C:\\Users\\scbll\\Downloads\\Musica';
    document.getElementById('currentPath').innerText = defaultPath;

    // Inicialmente ocultar el contenedor de archivos
    const fileListContainer = document.getElementById('fileList');
    fileListContainer.style.display = 'none';

    document.getElementById('downloadForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const url = document.getElementById('url').value.trim();
        const outputPath = document.getElementById('currentPath').innerText.trim();

        if (!url) {
            document.getElementById('result').innerText = 'Por favor, ingrese una URL válida.';
            return;
        }

        // Envía la URL y la ruta de descarga al proceso principal para iniciar la descarga
        window.electron.send('download', { url, outputPath });

        // Mensaje de estado para el usuario
        document.getElementById('result').innerText = 'Descargando...';

        // Ocultar la lista de archivos antes de la descarga
        fileListContainer.style.display = 'none';
    });

    // Limpiar el campo de URL
    document.getElementById('clearUrl').addEventListener('click', () => {
        document.getElementById('url').value = '';
        document.getElementById('result').innerText = '';

        // Ocultar la lista de archivos y vaciar el contenedor
        fileListContainer.style.display = 'none';
        document.getElementById('files').innerHTML = '';
    });

    // Seleccionar la ruta de descarga
    document.getElementById('selectPath').addEventListener('click', () => {
        window.electron.send('select-path');
    });

    // Recibir notificación de éxito o error desde el proceso principal
    window.electron.on('download-success', ({ message, files }) => {
        document.getElementById('result').innerText = message;

        // Mostrar el contenedor de archivos y actualizar la lista
        fileListContainer.style.display = 'block';
        updateFileList(files);
    });

    window.electron.on('download-error', (error) => {
        document.getElementById('result').innerHTML = `<strong style="color: red;">Error: ${error}</strong>`;
        // Ocultar la lista de archivos en caso de error
        fileListContainer.style.display = 'none';
    });

    // Actualizar la lista de archivos descargados
    function updateFileList(files) {
        const fileList = document.getElementById('files');
        fileList.innerHTML = '';
        if (Array.isArray(files) && files.length > 0) {
            files.forEach(file => {
                const li = document.createElement('li');
                li.textContent = file;
                fileList.appendChild(li);
            });
        } else {
            fileList.innerHTML = '<li>No se encontraron archivos.</li>';
        }
    }

    window.electron.on('path-selected', (path) => {
        document.getElementById('currentPath').innerText = path;
    });
});
