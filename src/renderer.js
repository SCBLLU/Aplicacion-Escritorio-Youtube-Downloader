document.addEventListener('DOMContentLoaded', () => {
    const defaultPath = 'C:\\youtube-downloads';
    const pathElement = document.getElementById('currentPath');
    pathElement.innerText = defaultPath;

    document.getElementById('downloadForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const url = document.getElementById('url').value.trim();
        const outputPath = pathElement.innerText.trim() || defaultPath;

        if (!url) {
            document.getElementById('result').innerText = 'Por favor, ingrese una URL válida.';
            return;
        }

        window.electron.send('download', { url, outputPath });
        document.getElementById('result').innerText = 'Descargando...';
        fileListContainer.style.display = 'none';
    });

    // Limpiar el campo de URL
    document.getElementById('clearUrl').addEventListener('click', () => {
        const urlInput = document.getElementById('url');
        urlInput.value = '';
        document.getElementById('result').innerText = '';

        fileListContainer.style.display = 'none';
        document.getElementById('files').innerHTML = '';

        if (!urlInput.value.trim()) {
            document.getElementById('result').innerText = 'Por favor, ingrese una URL válida.';
        }
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
        const pathElement = document.getElementById('currentPath');
        pathElement.innerText = path;

        // Efecto visual para mostrar el cambio
        pathElement.style.transition = 'background-color 0.3s ease';
        pathElement.style.backgroundColor = '#1aa34a';
        setTimeout(() => {
            pathElement.style.backgroundColor = 'transparent';
        }, 500);
    });

});
