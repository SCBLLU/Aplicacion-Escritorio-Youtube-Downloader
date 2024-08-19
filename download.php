<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $url = $_POST['url'];
    $outputPath = 'C:\\youtube-downloads';

    $command = "yt-dlp --extract-audio --audio-format mp3 --output \"{$outputPath}\\%(title)s.%(ext)s\" " . escapeshellarg($url);
    exec($command, $output, $return_var);

    if ($return_var !== 0) {
        echo "Error al descargar el archivo.";
    } else {
        echo "Descarga completada.";
    }
}
